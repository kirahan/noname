var timeResultFormat =  {
    sec2normal : function (value) {
        if(value == -1){
            return 'DNF'
        }else if(value==0){
            return 'DNF'
        }else if(value>0 && value<100){
            return '0.' + String(value)
        }else if(value <6000){
            return String(value/100)
        }else if(value <6000*60){
            var min = String(Math.floor(value/60/100))
            var sec = Math.floor((value - min*60*100)/100)
            sec = (sec <10) ? ('0'+ String(sec)): String(sec)
            var microsec = ((value%100)<10) ? ('0'+ String(value%100)) :String(value%100)
            console.log(min,sec,microsec)
            return min + ':'+sec+'.' +microsec
        }
    }
}

export default timeResultFormat