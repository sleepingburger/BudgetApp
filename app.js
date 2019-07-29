var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = (type) => {
        var sum = 0;
        data.allItems[type].forEach(cur => {
            sum += cur.value;
        });

        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: (type, desc, val) => {
            let newItem, ID;
            if (data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            else ID = 0;

            if (type === "exp") newItem = new Expense(ID, desc, val);
            else if (type === "inc") newItem = new Expense(ID, desc, val);
            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: () => {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else
                data.percentage = -1;
        },
        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },



        testing: () => {
            console.log(data);
        }
    };
})();

var UIController = (function () {
    var DOMStrings = {
        inputType: ".add-type",
        inputDesc: ".add-desc",
        inputVal: ".add-val",
        inputButton: ".add-budget",
        incomeContainer: ".inc-list",
        expenseContainer: ".exp-list",
        budgetTotal: ".budget-total",
        totalIncome: ".inc-total",
        totalExpense: ".exp-total",
        expensePercentage: ".exp-percentage"
    };

    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDesc).value,
                value: parseFloat(document.querySelector(DOMStrings.inputVal).value)
            };
        },
        addListItem: (obj, type) => {
            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = "<div class='inc-item row' id='inc-%id%'><div class='item-desc col-md-5'>%description%</div><div class='col-md-3'></div><div class='right clearfix col-md-4'><div class='item-value mr-1'>%value%<span class='badge badge-danger ml-5'>X</span></div></div></div>";
            }
            else if (type === 'exp') {
                element = DOMStrings.expenseContainer;
                html = "<div class='exp-item row' id='exp-%id%'><div class='item-desc col-md-5'>%description%</div><div class='col-md-3'></div><div class='right clearfix col-md-4'><div class='item-value mr-1'>%value%<span class='badge badge-danger ml-5'>X</span></div></div></div>";
            }


            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            //console.log(newHtml, element);


            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },


        clearFields: () => {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDesc + ',' + DOMStrings.inputVal);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(current => {
                current.value = "";
            });
            fieldsArr[0].focus();
        },

        displayBudget: (obj) => {
            document.querySelector(DOMStrings.budgetTotal).textContent = obj.budget;
            document.querySelector(DOMStrings.totalIncome).textContent = obj.totalInc;
            document.querySelector(DOMStrings.totalExpense).textContent = obj.totalExp;
            if (obj.percentage > 0)
                document.querySelector(DOMStrings.expensePercentage).textContent = obj.percentage + '%';
            else
                document.querySelector(DOMStrings.expensePercentage).textContent = '--';
        },
        getDOMStrings: () => {
            return DOMStrings;
        }
    };
})();

var controller = (function (bdgtCtrl, UICtrl) {
    var setEventListener = () => {
        var DOM = UICtrl.getDOMStrings();
        document
            .querySelector(DOM.inputButton)
            .addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", evt => {
            if (evt.keyCode === 13) {
                // submit the input to data structure
                ctrlAddItem();
            }
        });
    };


    var updateBudget = () => {
        var budget;
        bdgtCtrl.calculateBudget();
        budget = bdgtCtrl.getBudget();
        UICtrl.displayBudget(budget);

    }


    var ctrlAddItem = () => {
        var input, newItem;

        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = bdgtCtrl.addItem(input.type, input.description, input.value);

            UICtrl.addListItem(newItem, input.type);

            UICtrl.clearFields();

            updateBudget();
        }


        //get the input data
        //add the item to data structure
        //show to the ui
        //calculate the budget
        //update the ui
    };

    return {
        init: () => {
            console.log("starting");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setEventListener();
        }
    };
})(budgetController, UIController);

controller.init();
