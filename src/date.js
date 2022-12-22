const date = new Date();

// let month = date.getMonth() + 1
// let year = date.getFullYear()

// export {month, year}

const DateSingleton = (function () {
  let instance;

  function init() {
    let month = date.getMonth();
    let year = date.getFullYear();

    function setMonth(m) {
      if (m == -1) {
        month = 11;
        setYear(getYear() - 1);
      } else if (m == 12) {
        month = 0;
        setYear(getYear() + 1);
      }
      else{
        month = m
      }
    }

    function getMonth() {
      return month;
    }

    function setYear(y) {
      year = y;
    }

    function getYear() {
      return year;
    }

    return {
      setMonth: setMonth,
      getMonth: getMonth,
      setYear: setYear,
      getYear: getYear,
    };
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = init();
      }
      return instance;
    },
  };
})();

export { DateSingleton };
