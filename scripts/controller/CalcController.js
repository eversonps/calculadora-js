class CalcController{
    constructor(){
        this._operation
        this._locale = "pt-br"
        this._currentDate
        this._displayCalcEl = document.querySelector("#display")
        this._dateEl = document.querySelector("#data")
        this._timeEl = document.querySelector("#hora")
        this.initialize

    }

    setError(){
        this.displayCalc = "Error"
    }

    isOperator(value){
        return(["+", "-", "*", "/", "%"].indexOf(value) > -1)
    }

    getLastOperation(){
        return this._operation[this._operation.length - 1]
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value
    }

    setLastNumberToDisplay(){
        var lastNumber
        for(var i = this._operation.length-1; i >= 0; i--){
            if(!this.isOperator(this._operation[i])){
                lastNumber = this._operation[i]
                break
            }
        }

        if(!lastNumber){
            lastNumber = 0
        }

        this.displayCalc = lastNumber

    }

    calc(){
        let last = this._operation.pop()
        let result  = eval(this._operation.join(""))
        if(last == "%"){
            result /= 100
            this._operation = [result]
        }else{
            this._operation = [result, last]
        }
    }

    pushOperation(value){
        this._operation.push(value)

        if(this._operation.length > 3){
            console.log(this._operation)
            this.calc()
            this.setLastNumberToDisplay()
        }
    }
    
    addOperation(value){
        if(isNaN(this.getLastOperation())){
            // string
            if(this.isOperator(value)){
                this.setLastOperation(value)
            }else if(isNaN(value)){
                console.log(value)
            }else{
                this.pushOperation(value)
                this.setLastNumberToDisplay()
            }
        }else{
            if(this.isOperator(value)){
                this.pushOperation(value)
            }else{
                let valueConc = this.getLastOperation().toString() + value.toString()
                this.setLastOperation(parseInt(valueConc))
                this.setLastNumberToDisplay()
            }
        }
    }

    clearAll(){
        this._operation = []
        this.setLastNumberToDisplay()

    }

    clearEntry(){
        this._operation.pop()
        this.setLastNumberToDisplay()
    }

    btnExec(value){
        switch(value){
            case "ac":
                this.clearAll()
                break;
            case "ce":
                this.clearEntry()
                break;
            case "soma":
                this.addOperation("+")
                break;
            case "subtracao":
                this.addOperation("-")
                break;
            case "multiplicacao":
                this.addOperation("*")
                break;
            case "divisao":
                this.addOperation("/")
                break;
            case "porcento":
                this.addOperation("%")
                break;
            case "igual":
                this.addOperation("=")
            case "ponto":
                this.addOperation(".")
                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperation(parseInt(value))
                break;
            default:
                this.setError()
                break;

        }
    }

    addEventListenerAll(element, events, func){
        events = events.split(" ")
        events.forEach(ev=>{
            element.addEventListener(ev, func)
        })
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g")
        buttons.forEach(button => {
            this.addEventListenerAll(button, "click drag", () =>{
                this.btnExec(button.className.baseVal.replace("btn-", ""))
            })

            this.addEventListenerAll(button, "mouseover mouseup mousedown", ()=>{
                button.style.cursor = "pointer"
            })
        })
    }


    initialize(){
        this._operation = []
        this.setDisplayDateTime()
        setInterval(()=>{
            this.setDisplayDateTime()
        }, 1000)

    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }

    set displayCalc(calc){
        this._displayCalcEl.innerHTML = calc
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML
    }

    set displayDate(date){
        this._dateEl.innerHTML = date
    }

    get displayDate(){
        return this._dateEl.innerHTML
    }

    set displayTime(time){
        this._timeEl.innerHTML = time
    }

    get displayTime(){
        return this._timeEl.innerHTML     
    }

    set currentDate(valor){
        this._currentDate = valor
    }

    get currentDate() {
        return new Date()
    }
}