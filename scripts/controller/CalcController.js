class CalcController{
    constructor(){
        this._audio = new Audio("click.mp3")
        this._audioOnOff = false
        this._lastOperator = ""
        this._lastNumber = ""
        this._operation = []
        this._locale = "pt-br"
        this._currentDate
        this._displayCalcEl = document.querySelector("#display")
        this._dateEl = document.querySelector("#data")
        this._timeEl = document.querySelector("#hora")
        this.initialize()
        this.initKeyBoard()
        this.initButtonsEvents()
        
    }

    set displayCalc(calc){

        this._displayCalcEl.innerHTML = calc

        if(calc.toString().length > 10){
            this.setError()
        }
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

    copyToClipboard(){
        let input = document.createElement("input")
        input.value = this.displayCalc
        document.body.appendChild(input)
        input.select()
        document.execCommand("Copy")
    }

    initialize(){
        this.setDisplayDateTime()
        setInterval(()=>{
            this.setDisplayDateTime()
        }, 1000)
        this.pasteFromClipboard()

        document.querySelectorAll(".btn-ac").forEach(btn=>
            btn.addEventListener("dblclick", e=>{
                this.toogleAudio()
            })
        )
    }

    toogleAudio(){
        this._audioOnOff = !this._audioOnOff
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0
            this._audio.play()
        }
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
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

    initKeyBoard(){
        document.addEventListener("keyup", e=>{
            this.playAudio()
            switch(e.key){
                case "Escape":
                    this.clearAll()
                    break;
                case "Backspace":
                    this.clearEntry()
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    this.addOperation(e.key)
                    break;
                case "=":
                case "Enter":
                    this.calc()
                    break;
                case ".":
                case ",":
                    this.addDot()
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
                    this.addOperation(parseFloat(e.key))
                    break;
                case "c":
                    if(e.ctrlKey){
                        this.copyToClipboard() 
                        break;
                    }       
            }
        })
    }

    pasteFromClipboard(){
        document.addEventListener("paste", e=>{
            let text = e.clipboardData.getData("Text")
            this.displayCalc = parseFloat(text)
        })
    }
    
    addEventListenerAll(element, events, func){
        events = events.split(" ")
        events.forEach(ev=>{
            element.addEventListener(ev, func)
        })
    }

    btnExec(value){
        this.playAudio()
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
                this.calc()
                break;
            case "ponto":
                this.addDot()
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
                this.addOperation(parseFloat(value))
                break;
            default:
                this.setError()
                break;

        }
    }

    addOperation(value){
        if(isNaN(this.getLastOperation())){
            // caso o ultimo operador não seja um número
            if(this.isOperator(value)){
                // caso o valor atual seja um operador
                this.setLastOperation(value)
            }else{
                // caso o valor atual seja um número
                this.pushOperation(value)
                this.setLastNumberToDisplay()
            }
        }else{
            // caso o ultimo operador seja um número
            if(this.isOperator(value)){
                // caso o valor atual seja um operador
                this.pushOperation(value)
            }else{
                // caso o valor atual seja um número
                let valueConc = this.getLastOperation().toString() + value.toString()
                this.setLastOperation(valueConc)
                this.setLastNumberToDisplay()
            }
        }
    } 

    getLastOperation(){
        return this._operation[this._operation.length - 1]
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value
    }

    isOperator(value){
        return(["+", "-", "*", "/", "%"].indexOf(value) > -1)
    }

    pushOperation(value){
        this._operation.push(value)
        if(this._operation.length > 3){
            this.calc()
        }
    }

    calc(){
        let last = ""
        this._lastOperator = this.getLastItem()

        if(this._operation.length < 3){
            let firstNumber = this._operation[0]
            this._operation = [firstNumber, this._lastOperator, this._lastNumber]
        }

        if(this._operation.length == 3){ 
            this._lastNumber = this.getLastItem(false)
        } else if(this._operation.length > 3){
            last = this._operation.pop()  
            this._lastNumber = this.getResult() 
        }

        let result  = this.getResult()
        if(last == "%"){
            result /= 100
            this._operation = [result]
        }else{
            this._operation = [result]
            
            if(last){
                this._operation.push(last)
            }
        }

        this.setLastNumberToDisplay()
    }

    getResult(){
        try{
            return eval(this._operation.join(""))
        } catch(e){
            setTimeout(()=>{
                this.setError(e)
            }, 1)
        }
        
    }

    getLastItem(isOperator = true){
        let lastItem

        for(let i = this._operation.length - 1; i >= 0; i--){
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i]
                break
            }
        }

        if(!lastItem){
           lastItem = (isOperator) ?  this._lastOperator : this._lastNumber
        } 
        
        return lastItem
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false)
        if(!lastNumber){
            lastNumber = 0
        }
        this.displayCalc = lastNumber
    }

    clearAll(){
        this._operation = []
        this._lastNumber = ""
        this._lastOperator = ""
        this.setLastNumberToDisplay()
    }

    clearEntry(){
        this._operation.pop()
        this.setLastNumberToDisplay()
    }

    setError(){
        this.displayCalc = "Error"
    }

    addDot(){
        let lastOperation = this.getLastOperation()
        if(typeof lastOperation === "string" && lastOperation.split("").indexOf(".") > -1){
            return
        }
        if(this.isOperator(lastOperation) || !lastOperation && lastOperation != 0){
            this.pushOperation("0.")
        } else{
            console.log(lastOperation)
            this.setLastOperation(lastOperation.toString() + ".")
        }

        this.setLastNumberToDisplay()
    }
}