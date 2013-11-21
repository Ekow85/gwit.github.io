/*jslint browser: true */
/*global _, jQuery, $, console, Backbone */

var discover = {};

(function($){
    
    discover.Activity = Backbone.Model.extend({
    });
    
    discover.Activities = Backbone.Collection.extend({
        model: discover.Activity,
        url: "discover.json",
        comparator: function(activity){
            var date = new Date(activity.get('date'));
            return date.getTime();
        }
    });
    
    discover.ActivityListView = Backbone.View.extend({
        tagName: 'ul',
        id: 'activities-list',
        attributes: {"data-role": 'listview'},
        
        initialize: function() {
            this.template = _.template($('#activity-list-item-template').html());
        },
        
        render: function() {
            var container = this.options.viewContainer,
                activities = this.collection,
                template = this.template,
                listView = $(this.el);
                
            $(this.el).empty();
            activities.each(function(activity){
                var renderedItem = template(activity.toJSON()),
                    $renderedItem = $(renderedItem);  //convert the html into an jQuery object
                    $renderedItem.jqmData('activityId', activity.get('id'));  //set the data on it for use in the click event
                $renderedItem.bind('click', function(){
                    //set the activity id on the page element for use in the details pagebeforeshow event
                    $('#activity-details').jqmData('activityId', $(this).jqmData('activityId'));  //'this' represents the element being clicked
                });
                listView.append($renderedItem);
            });
            container.html($(this.el));
            container.trigger('create');
            return this;
        }
    });
    
    discover.ActivityDetailsView = Backbone.View.extend({
        //since this template will render inside a div, we don't need to specify a tagname
        initialize: function() {
            this.template = _.template($('#activity-details-template').html());
        },
        
        render: function() {
            var container = this.options.viewContainer,
                activity = this.model,
                renderedContent = this.template(this.model.toJSON());
                
            container.html(renderedContent);
            container.trigger('create');
            return this;
        }
    });
    
    	discover.initData = function(){
        discover.activities = new discover.Activities();
        discover.activities.fetch({async: false});  // use async false to have the app wait for data before rendering the list
    };
    
}(jQuery));

$('#disc_sugg').live('pageinit', function(event){
    var activitiesListContainer = $('#disc_sugg').find(":jqmData(role='content')"),
        activitiesListView;
    discover.initData();
    activitiesListView = new discover.ActivityListView({collection: discover.activities, viewContainer: activitiesListContainer});
    activitiesListView.render();
});

$('#activity-details').live('pagebeforeshow', function(){
    console.log('activityId: ' + $('#activity-details').jqmData('activityId'));
    var activitiesDetailsContainer = $('#activity-details').find(":jqmData(role='content')"),
        activityDetailsView,
        activityId = $('#activity-details').jqmData('activityId'),
        activityModel = discover.activities.get(activityId);
    
    activityDetailsView = new discover.ActivityDetailsView({model: activityModel, viewContainer: activitiesDetailsContainer});
    activityDetailsView.render();
});
