$(document).ready(function(){

	App.Likes = {
		
		//baseUrl: 'http://localhost/laravel/public/',
		baseUrl: 'http://mo.aitormurray.com',

		initialize: function(){
		
			// Models
			var LikeItem = Backbone.Model.extend({
				defaults: {
					urlRoot: App.Likes.baseUrl + 'API/likes/',
					name: 'Empty like...',
					description: 'Empty like...',
					picture: 'img/placeholder.jpg',
					link: 'www.defaultlink.com'
				}
			});

			// Views
			var LikeView = Backbone.View.extend({
				tagName: 'div',
				className: 'like',
				template: _.template('\
						<div class="title"> \
							<h1><%= name %></h1> \
						</div> \
						<div class="image"> \
							<img src="'+ App.Likes.baseUrl +'/img/likes/<%= picture %>"> \
						</div> \
						<div class="description"> \
							<p><%= description %></p> \
						</div> \
						<div class="link"> \
							<a href="#"><%= link %></a> \
						</div>'),
				render: function(){
					var attributes = this.model.toJSON();
					this.$el.html(this.template(attributes));
					return this;
				}
			});

			// Collection
			var LikeList = Backbone.Collection.extend({
				model: LikeItem,
				url: App.Likes.baseUrl + '/API/likes'
			});

			var LikeListView = Backbone.View.extend({
				initialize: function(){
					this.collection.on('add', this.addOne, this);
					this.collection.on('reset', this.addAll, this);
				},
				addOne: function(likeItem){
					var likeView = new LikeView({model: likeItem});
					this.$el.append(likeView.render().el);
				},
				addAll: function(){
					this.collection.forEach(this.addOne, this);
					$(document).trigger('readyToShow');

				},
				render: function(){
					this.addAll();
				}
			});


		// Execute
		var likeList = new LikeList();
		var likeListView = new LikeListView({collection: likeList});
		
		$(document).on('readyToShow', function(){
			$('.container').append(likeListView.el);
			$('.container').animate({opacity: 1}, 500);
			App.Likes.loading(false);

		});

		likeList.fetch({
			reset: true,
			error: function(){
				$('.container').append("Error de conexion");
			}
		});
	
		},
		loading: function(bool) {
			if(!bool){
				return $('.loading').hide();
			} else {
				return $('.loading').show();
			}
		}
	};
});




