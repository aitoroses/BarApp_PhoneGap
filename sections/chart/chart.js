// Generated by CoffeeScript 1.6.1
(function() {

  $(document).ready(function() {
    /* Helper functions
    */

    var templateEscape;
    templateEscape = function(str) {
      str = str.replace(/&lt;/g, "<");
      return str = str.replace(/&gt;/g, ">");
    };
    return App.Chart = {
      baseUrl: 'http://mo.aitormurray.com/',
      collections: {},
      collectionViews: {},
      sectionControllers: {},
      initialize: function() {
        var main, wineCategories, winesSection, _sectionControllers;
        this.mvcInit();
        this.fetchWines();
        _sectionControllers = this.sectionControllers;
        /* 
        			*************************************************************
        			MAIN
        			*************************************************************
        */

        main = new App.Chart.Controllers.SectionController('#main-section', function() {
          var wines;
          wines = $("#main-section .cell.wines");
          return wines.click(function() {
            _sectionControllers.wineCategories.appear();
            return setTimeout(function() {
              var _winesSection;
              _winesSection = _sectionControllers.winesSection;
              _winesSection.appear();
              return _winesSection.listenToEvents(_winesSection.selector, _winesSection.accesoryType);
            }, 300);
          });
        });
        /* 
        			*************************************************************
        			WINES
        			*************************************************************
        */

        wineCategories = new App.Chart.Controllers.SectionController('#wine-categories-section', (function() {
          var categories;
          categories = $('#wine-categories-section .cell');
          return categories.click(function() {
            var type, _winesSection;
            type = $(this).data('category');
            _winesSection = _sectionControllers.winesSection;
            return _winesSection.change(function() {
              var filtered_models, model, _List, _ListView;
              _List = $.extend({}, App.Chart.collections.wineCellList);
              _ListView = App.Chart.collectionViews.wineCellListView;
              _ListView.collection = _List;
              filtered_models = (function() {
                var _i, _len, _ref, _results;
                _ref = _List.models;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  model = _ref[_i];
                  if (model.get('category') === type || type === 'Todos') {
                    _results.push(model.toJSON());
                  }
                }
                return _results;
              })();
              _List.reset(filtered_models);
              return _ListView.render();
            });
          });
        }), 'tickable');
        winesSection = new App.Chart.Controllers.SectionController('#wines-section', function() {
          return $('#wines-section .cell').click(function() {
            var id;
            id = $(this).find('.title').data('id');
            return App.Chart.showWindow('wine', id);
          });
        });
        /* 
        			*************************************************************
        			PINCHOS
        			*************************************************************
        */

        this.sectionControllers.main = main;
        this.sectionControllers.wineCategories = wineCategories;
        this.sectionControllers.winesSection = winesSection;
        return this.sectionControllers.main.show();
      },
      fetchWines: function() {
        this.collections.wineCellList = new this.Collections.ProductCellList();
        this.collections.wineCellList.type('wines');
        this.collectionViews.wineCellListView = new this.CollectionViews.ProductCellListView({
          collection: this.collections.wineCellList
        });
        $('#wines-section').append(this.collectionViews.wineCellListView.el);
        return this.collections.wineCellList.fetch({
          reset: true
        });
      },
      productUrl: function(type, id) {
        return "" + this.baseUrl + "application/" + type + "/" + id;
      },
      showWindow: function(type, id) {
        $('.window').load("sections/chart/views/product.html");
        $('#chart').animate({
          opacity: 0
        }, 100);
        setTimeout(function() {
          return $('.window').addClass('appear');
        }, 300);
        return location.href = '#';
      },
      goback: function() {
        $('.window').removeClass('appear');
        return setTimeout(function() {
          return $('#chart').animate({
            opacity: 1
          }, 100);
        }, 300);
      },
      /* 
      		*************************************************************
      		MVC PATTERN 
      		*************************************************************
      */

      mvcInit: function() {
        var SectionController,
          _this = this;
        this.Models = {
          ProductCell: Backbone.Model.extend({
            defaults: {
              name: 'Default product'
            }
          })
        };
        this.Views = {
          ProductView: Backbone.View.extend({
            tagName: 'div',
            className: 'cell',
            template: _.template(templateEscape($('#productCell').html())),
            render: function() {
              var attributes;
              attributes = this.model.toJSON();
              return this.$el.html(this.template(attributes));
            }
          })
        };
        this.Collections = {
          ProductCellList: Backbone.Collection.extend({
            model: App.Chart.Models.ProductCell,
            url: "" + App.Chart.baseUrl + "API/" + this.type,
            type: function(type) {
              return this.url = "" + App.Chart.baseUrl + "API/" + type;
            }
          })
        };
        this.CollectionViews = {
          ProductCellListView: Backbone.View.extend({
            className: 'cells',
            tagName: 'ul',
            initialize: function() {
              this.collection.on('add', this.addOne, this);
              return this.collection.on('reset', this.addAll, this);
            },
            addOne: function(model) {
              var productCellView;
              productCellView = new App.Chart.Views.ProductView({
                model: model
              });
              productCellView.render();
              return this.$el.append(productCellView.el);
            },
            addAll: function() {
              return this.collection.forEach(this.addOne, this);
            },
            render: function() {
              this.$el.html('');
              return this.addAll();
            }
          })
        };
        return this.Controllers = {
          SectionController: SectionController = (function() {

            SectionController.prototype.accesoryType = '';

            SectionController.prototype.selector = '';

            SectionController.prototype.handler = function() {};

            function SectionController(selector, handler, accesoryType) {
              var _this = this;
              this.selector = selector;
              this.handler = handler != null ? handler : this.handler;
              this.accesoryType = accesoryType != null ? accesoryType : 'default';
              this.change = function(handler) {
                return SectionController.prototype.change.apply(_this, arguments);
              };
              this.leave = function() {
                return SectionController.prototype.leave.apply(_this, arguments);
              };
              this.listenToEvents(selector, accesoryType);
              this.handler();
            }

            SectionController.prototype.listenToEvents = function(sel, accesoryType) {
              return $("" + sel + " .cell").click(function() {
                $("" + sel + " .cell").removeClass('press');
                $(this).addClass('press');
                if (accesoryType === 'tickable') {
                  $(sel).find('.accesory').removeClass('active');
                  return $(this).find('.accesory').addClass('active');
                }
              });
            };

            SectionController.prototype.refresh = function() {
              return this.handler();
            };

            SectionController.prototype.show = function() {
              var _this = this;
              return setTimeout(function() {
                return $(_this.selector).toggleClass('show');
              }, 300);
            };

            SectionController.prototype.appear = function() {
              var _this = this;
              this.refresh();
              return setTimeout(function() {
                $(_this.selector).show();
                return $(_this.selector).addClass('appear');
              }, 300);
            };

            SectionController.prototype.leave = function() {
              var _this = this;
              return setTimeout(function() {
                $(_this.selector).removeClass('appear');
                return setTimeout(function() {
                  return $(_this.selector).hide();
                }, 500);
              }, 300);
            };

            SectionController.prototype.change = function(handler) {
              var _this = this;
              $(this.selector).removeClass('appear');
              setTimeout(function() {
                return handler();
              }, 400);
              return setTimeout(function() {
                _this.refresh();
                return $(_this.selector).addClass('appear');
              }, 600);
            };

            return SectionController;

          })()
        };
      }
    };
  });

}).call(this);
