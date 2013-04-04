$(document).ready ->
	### Helper functions ###

	templateEscape = (str) ->
		str = str.replace(/&lt;/g, "<")
		str = str.replace(/&gt;/g, ">")

	# APP

	App.Chart =
		#baseUrl: 'http://localhost/laravel/public/'
		baseUrl: 'http://mo.aitormurray.com/'
		collections: {}
		collectionViews: {}
		sectionControllers: {}
		initialize: ->
			# Initialize MVC pattern
			@mvcInit()
			# Fetch data for the application
			@fetchWines()
			# Section controllers
			_sectionControllers = @sectionControllers
			# Create Section controllers
			### 
			*************************************************************
			MAIN
			*************************************************************
			###
			main = new App.Chart.Controllers.SectionController '#main-section', -> 
				# Cells behavior
				# Case of wines
				wines = $("#main-section .cell.wines")
				wines.click ->
					_sectionControllers.wineCategories.appear()
					setTimeout( ->
						_winesSection = _sectionControllers.winesSection
						_winesSection.appear()
						_winesSection.listenToEvents(_winesSection.selector, _winesSection.accesoryType)
					, 300)
			### 
			*************************************************************
			WINES
			*************************************************************
			###
			# WineCategories section
			wineCategories = new App.Chart.Controllers.SectionController '#wine-categories-section', (->
				# Cells behavior
				categories = $('#wine-categories-section .cell')
				# on Click
				categories.click ->
					# Get the type
					type = $(this).data('category')
					_winesSection = _sectionControllers.winesSection
					_winesSection.change -> 
						# Make changes in the section
						# Refresh cells with the celltype
						_List = $.extend({}, App.Chart.collections.wineCellList)
						_ListView = App.Chart.collectionViews.wineCellListView
						_ListView.collection = _List
						# Filter models
						filtered_models = (model.toJSON() for model in _List.models when model.get('category') == type or type == 'Todos')
						_List.reset(filtered_models)
						_ListView.render()
				), 'tickable'
			winesSection = new App.Chart.Controllers.SectionController '#wines-section' , ->
				$('#wines-section .cell').click ->
					id = $(this).find('.title').data('id')
					App.Chart.showWindow('wine', id)

			### 
			*************************************************************
			PINCHOS
			*************************************************************
			#####


			# Save Controllers
			@sectionControllers.main = main
			@sectionControllers.wineCategories = wineCategories
			@sectionControllers.winesSection = winesSection
			
			# Show main section
			@sectionControllers.main.show()
			
		fetchWines: ->
			# Get and show wine cells
			@.collections.wineCellList = new @Collections.ProductCellList()
			@.collections.wineCellList.type('wines')
			# Create the view
			@.collectionViews.wineCellListView = new @CollectionViews.ProductCellListView({collection: @.collections.wineCellList})
			# Append the view
			$('#wines-section').append @collectionViews.wineCellListView.el
			@.collections.wineCellList.fetch({reset: true})

		productUrl: (type, id) ->
			"#{@baseUrl}application/#{type}/#{id}"

		showWindow: (type, id) ->
			#$('.window').load("#{App.Chart.productUrl(type, id)}")
			$('.window').load("sections/chart/views/product.html")
			$('#chart').animate({opacity:0}, 100)
			setTimeout( ->
				$('.window').addClass('appear')
			, 300)
			location.href = '#'
		goback: ->
			$('.window').removeClass('appear')
			setTimeout( ->
				$('#chart').animate({opacity:1}, 100)
			, 300);



		### 
		*************************************************************
		MVC PATTERN 
		*************************************************************
		###

		mvcInit: ->
			# Models
			@Models =
				ProductCell: Backbone.Model.extend
					defaults:
						name: 'Default product'
						#picture: "#{AppChart.Chart.baseUrl}img/placeholder.jpg"
			# Views
			@Views =
				ProductView: Backbone.View.extend
					tagName: 'div'
					className: 'cell'
					template: _.template templateEscape $('#productCell').html()
					render: ->
						attributes = @model.toJSON()
						@.$el.html @template attributes
			# Collections
			@Collections =
				ProductCellList: Backbone.Collection.extend
					model: App.Chart.Models.ProductCell
					url: "#{App.Chart.baseUrl}API/#{@type}"
					type : (type) ->
						@url = "#{App.Chart.baseUrl}API/#{type}"
				
			# CollectionViews
			@CollectionViews =
				ProductCellListView: Backbone.View.extend
					className: 'cells'
					tagName: 'ul'
					initialize: ->
						@collection.on('add', @addOne, @)
						@collection.on('reset', @addAll, @)
					addOne: (model) ->
						productCellView = new App.Chart.Views.ProductView {model: model}
						productCellView.render()
						@.$el.append productCellView.el
					addAll: ->
						@collection.forEach(@addOne, @)
					render: ->
						@.$el.html('')
						@addAll()

			# Controllers
			@Controllers = 
				SectionController: class SectionController
					accesoryType: '' # ['default', 'tickable']
					selector: ''
					handler: ->
					constructor: (@selector, @handler = @handler, @accesoryType = 'default') ->
						# @param selector define el selector que identifica la seccion
						# @param handlear es la funcion que determina el funcionamiento de las celdas
						# @param accesoryType define el tipo de celda
						@listenToEvents(selector, accesoryType)
						@handler()
					listenToEvents: (sel, accesoryType) ->
						$("#{sel} .cell").click ->
							$("#{sel} .cell").removeClass('press')
							$(@).addClass('press')
							if(accesoryType == 'tickable')
								$(sel).find('.accesory').removeClass('active')
								$(@).find('.accesory').addClass('active')
					refresh: ->
						# Refreshes the action of the actual cells
						@handler()
					show: ->
						setTimeout( =>
							$(@selector).toggleClass('show')
						, 300)
					appear: ->
						@refresh()
						setTimeout( =>
							$(@selector).show()
							$(@selector).addClass('appear')
						, 300)
					leave: =>
						setTimeout( =>
							$(@selector).removeClass('appear')
							setTimeout( =>
								$(@selector).hide()
							, 500)
						, 300)
					change: (handler) =>
						$(@selector).removeClass('appear')
						setTimeout( =>	
							handler()
						, 400)
						setTimeout( =>
							@refresh()
							$(@selector).addClass('appear')
						, 600)


