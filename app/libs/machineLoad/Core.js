class Core {
    constructor(config) {
        this.config = config;
    }

    setStartWork(dateTime, timeResidual = 0) {
        var intTimeStart = parseInt(this.config.timeStart);
        var intTimeResidual = parseInt(timeResidual)
        var newDateTime = dateTime.setHours(intTimeStart + intTimeResidual);

        return new Date(newDateTime);
    }

    getIntTimeResidualAfterLimit(dateTime) {
       //FUNCAO QUE PEGA O HORARIO RESIDUAL APOS AS 17 ATÉ AS 00 HORAS
        var intTimeLimit = parseInt(this.config.timeLimit);
        var newTimeResidual = "";
        if (dateTime.getHours() > intTimeLimit || dateTime.getHours() == 0) {
            if (dateTime.getHours() == 0) {
                newTimeResidual = 7;
            } else {
                newTimeResidual = dateTime.getHours() - intTimeLimit;
            }

            return parseInt(newTimeResidual);
        } else {
            return dateTime
        }
    }

    verifyDateTimeAfterLimit(dateTime){
        var intDateTime = dateTime.getHours();
        
        if(intDateTime >= parseInt(this.config.timeLimit))
        {   
            return {
                "newDateTimeAfter": true,
                "dateTime":new Date(dateTime.setDate(dateTime.getDate()+1))
            };
        }else{
            return {
                "newDateTimeAfter": false,
                "dateTime": new Date(dateTime)
            }
        }
    }

    verifyWeekend(dateTime) {
        switch (dateTime.getDay()) {
            case 0:
                return new Date(dateTime.setDate(dateTime.getDate() + 1));
                break;

            case 6:
                return new Date(dateTime.setDate(dateTime.getDate() + 2));
                break;
            default:
                return new Date(dateTime);
                break;
        }
    }

    verifyBeforeTimeStart(dateTime)
    {
        var intTimeStart = parseInt(this.config.timeStart);
        var intDateTime = parseInt(dateTime.getHours());
        
        if(intDateTime < intTimeStart)
        {
            var intTimeResidualAfterLimit = 24 - parseInt(this.config.timeLimit);
            var intDiffTimerBeforeTimeAfter = intTimeStart - intDateTime;

            var newIntTime = intDateTime + intDiffTimerBeforeTimeAfter + intTimeResidualAfterLimit;

            if(this.config.lunch.lunchValue)
            {
                if(newIntTime > 12)
                {
                    newIntTime += 1;
                }
            }

            return new Date(dateTime.setHours(newIntTime));
        }

        return dateTime;
    }   
}



module.exports = Core;
