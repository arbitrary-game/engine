export default (then, always) => {
  return function(error) {
    if (error) {
      alert(error);
    } else {
      then && then.apply(this, arguments);
    }
    always && always.apply(this, arguments);
  };
};
