class CalcController{
    constructor(){
        this._locale = "pt-br"
        this._currentDate
        this._displayCalcEl = document.querySelector("#display")
        this._dateEl = document.querySelector("#data")
        this._timeEl = document.querySelector("#hora")
        this.initialize

    }

    initialize(){
        this.displayCalc = "0"
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