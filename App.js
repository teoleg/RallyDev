Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        this.iterationCombobox = this.add({
            xtype: 'rallyiterationcombobox',
            listeners: {
                ready: this._onIterationComboboxLoad,
                select: this._onIterationComboboxChanged,
                scope: this
            }
        });
    },

    _onIterationComboboxLoad: function() {
        var addNewConfig = {
            xtype: 'rallyaddnew',
            recordTypes: ['User Story', 'Defect'],
            ignoredRequiredFields: ['Name', 'ScheduleState', 'Project'],
            showAddWithDetails: true,
            listeners: {
                create: function(addNew, record) {
                       this.Msg.alert('Add New', 'Added record named ' + record.get('Name'));
                       },
                beforecreate: this._onBeforeCreate,
                scope: this
            }
        };

        this.addNew = this.add(addNewConfig);

        var cardBoardConfig = {
            xtype: 'rallycardboard',
            context: this.getContext(),
            types: ['Defect', 'User Story'],
            attribute: 'ScheduleState',
            storeConfig: {
                filters: [this.iterationCombobox.getQueryFromSelected()]
            }
        };
        this.cardBoard = this.add(cardBoardConfig);
	//this.render();
    },

    _onBeforeCreate: function(addNewComponent, record) {
        record.set('Iteration', this.iterationCombobox.getValue());
    },

    _onIterationComboboxChanged: function() {
        var config = {
            storeConfig: {
                filters: [this.iterationCombobox.getQueryFromSelected()]
            }
        };

        this.cardBoard.refresh(config);
    }
});
