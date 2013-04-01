$(document).ready ->
  # Load data on the page


  # Helper functions

  templateEscape = (str) ->
    str = str.replace(/&lt;/g, "<")
    str = str.replace(/&gt;/g, ">")

  
  App.Employees =

    #baseUrl: 'http://localhost/laravel/public/'
    baseUrl: 'http://mo.aitormurray.com/'

    initialize: ->
      # Models

      Employee = Backbone.Model.extend
        urlRoot: "#{App.Employees.baseUrl}/API/employees"
        defaults: ''

      # Views

      EmployeeView = Backbone.View.extend
        tagName: 'article'
        className: 'employee'
        template: _.template templateEscape $('#template').html()
        render: ->
          @.$el.html @template @model.toJSON()
          # Set the images
          @.$el.find('.picture img').attr('src', "#{App.Employees.baseUrl}img/employees/#{@model.attributes.picture}")
          @.$el.find('.gender img').attr('src', "img/#{@model.attributes.gender}-gender-sign.jpg")
          @

      # Collections

      EmployeeList = Backbone.Collection.extend
        model: Employee
        url: "#{App.Employees.baseUrl}/API/employees"

      # Collection Views

      EmployeeListView = Backbone.View.extend
        initialize: ->
          @.collection.on('add', @addOne, @)
          @.collection.on('reset', @addAll, @)
        addOne: (model) ->
          View = new EmployeeView({model: model})
          # Render view
          View.render()
          # Append
          @.$el.append View.el
        addAll: ->
          @.collection.forEach(@addOne, @);
          $(document).trigger 'showList'
        render: ->
          @.addAll()
            
      employeeList = new EmployeeList() 
      employeeListView= new EmployeeListView({collection: employeeList})
      $(document).on 'showList', ->
        $('#container').animate({opacity: 1}, 500)
        $('.loading').hide()
      employeeList.fetch
        reset: true
        success: (e) ->
          console.log(e)
        error: (e) ->
          console.log(e)
          $('#container').append("Error de conexion");

      $('#container').append(employeeListView.el)

  