import _ from "lodash";
export default (e, models) => {
  //if e is a validation error do this
  if (e instanceof models.sequelize.ValidationError) {
    //here pick _.pick{a:1,b:2}, 'a' => {a:1} only return the selected obj
    //here this will returns the path and the message if the error exists
    //the errors defnitions are given in the validator in the models
    //x is the error thats related to the validator
    //so this will return the related name with message
    //so pick will return the selected things here its name and message
    return e.errors.map(x => _.pick(x, ["path", "message"]));
  }

  //if the validator in the models don't have the error defnition (not created)
  //new errors we are not created in the models validation
  //this will return this
  //path is the name of the error
  return [{ path: "name", message: "Somthing went wrong" }];
};
