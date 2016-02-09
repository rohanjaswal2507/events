// configure the special accounts user interface
// by setting up some extra fields and specifying constraints
// see:https://github.com/ianmartorell/meteor-accounts-ui-bootstrap-3/
Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'first-name',
        fieldLabel: 'Name of the Club',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please write your first name");
            return false;
          } else {
            return true;
          }
        }
    },
    {
        fieldName: 'terms',
        fieldLabel: 'I accept the terms and conditions <a href="">See t and x...</a>',
        inputType: 'checkbox',
        visible: true,
        saveToProfile: false,
        validate: function(value, errorFunction) {
            if (value) {
                return true;
            } else {
                errorFunction('You must accept the terms and conditions.');
                return false;
            }
        }
    }]
});
