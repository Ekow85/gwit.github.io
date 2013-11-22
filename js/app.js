/*jslint browser: true */
/*global _, jQuery, $, console, Backbone */

var disc = {};

(function($){
    
    disc.Activity = Backbone.Model.extend({
    });
    
    disc.Activities = Backbone.Collection.extend({
        model: disc.Activity,
        url: "js/disc.json",
    });
    
    disc.ActivityListView = Backbone.View.extend({
        tagName: 'ul',
        id: 'activities-list',
        attributes: {"data-role": 'listview'},
        
        initialize: function() {
            this.collection.bind('add', this.render, this);
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
		    $('#activity-sub-list').jqmData('activityId', $(this).jqmData('activityId'));  //'this' represents the element being clicked
                });
                listView.append($renderedItem);
            });
            container.html($(this.el));
            container.trigger('create');
            return this;
        }
    });
    
    disc.ActivityDetailsView = Backbone.View.extend({
        //since this template will render inside a div, we don't need to specify a tagname
        initialize: function() {
	    this.template = _.template($('#activity-sub-list-template').html());
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
    
    disc.initData = function(){
        disc.activities = new disc.Activities();
        disc.activities.fetch({async: false});  // use async false to have the app wait for data before rendering the list
    };
    
}(jQuery));

$('#discover').live('pageinit', function(event){
    var activitiesListContainer = $('#discover').find(":jqmData(role='listview')"),
        activitiesListView;
    disc.initData();
    activitiesListView = new disc.ActivityListView({collection: disc.activities, viewContainer: activitiesListContainer});
    activitiesListView.render();
});

$('#activity-sub-list').live('pagebeforeshow', function(){
    console.log('activityId: ' + $('#activity-sub-list').jqmData('activityId'));
    var activitiesDetailsContainer = $('#activity-sub-list').find(":jqmData(role='listview')"),
        activityDetailsView,
        activityId = $('#activity-sub-list').jqmData('activityId'),
        activityModel = disc.activities.get(activityId);
    
   activityDetailsView = new disc.ActivityDetailsView({model: activityModel, viewContainer: activitiesDetailsContainer});
   activityDetailsView.render();
});
