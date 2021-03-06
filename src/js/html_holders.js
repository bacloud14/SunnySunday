class AqiCard {
  constructor (language, aqi, today, co, no, no2) {
    const theme = {
      1: '#4C5273',
      2: '#F2E96B',
      3: '#F2CA50',
      4: '#F2A03D',
      5: '#A67041'
    }
    this.style = 'background-color: ' + theme[aqi]
    this.aqiInterpretation = _aqiLangs(language)
    this.aqi = aqi
    const d = new Date(0)
    d.setUTCSeconds(today)
    this.ISODate = d.toISOString().slice(5, 10)
    this.dayName = _weekdaysLangs(language)[d.getDay()]
    this.co = co
    this.no = no
    this.no2 = no2
  }

  html () {
    let coo = 1
    const showClass = _isMobile ? '' : 'show'
    const collapseIcon = '<i class="bi bi-arrows-collapse"></i>'
    return (`
        <div class="col-md-3" style="margin-top:20px;">
            <div class="card" style="${this.style}">
                <h4 class="card-title text-center" data-toggle="collapse" href="#collapseId20" role="button" aria-expanded="false">${collapseIcon}${this.aqiInterpretation[this.aqi]}</h4>
                <table style="width:100%">
                    <tr>
                        <th style= 'background-color: #4C5273; font-size: xx-small'>${this.aqiInterpretation[coo++].split(':')[1].trim()}</th>
                        <th style= 'background-color: #F2E96B; font-size: xx-small'>${this.aqiInterpretation[coo++].split(':')[1].trim()}</th>
                        <th style= 'background-color: #F2CA50; font-size: xx-small'>${this.aqiInterpretation[coo++].split(':')[1].trim()}</th>
                        <th style= 'background-color: #F2A03D; font-size: xx-small'>${this.aqiInterpretation[coo++].split(':')[1].trim()}</th>
                        <th style= 'background-color: #A67041; font-size: xx-small'>${this.aqiInterpretation[coo++].split(':')[1].trim()}</th>
                    </tr>
                </table>
                <div class="card-body">
                    <div class="collapse" id="collapseId20">
                        <h5 class="card-title text-center">${this.dayName}\n${this.ISODate}</h5>
                        <p class="card-text text-center">CO: ${this.co} <br />NO: ${this.no}<br />NO2: ${this.no2}</p>
                    </div>
                </div>
            </div>
        </div>
    `)
  }
}

class TemperatureCard {
  constructor (language, period, maxTemp, minTemp, currentMarked, co) {
    this.period = period
    this.maxTemp = maxTemp
    this.minTemp = minTemp
    this.currentMarked = currentMarked
    const d = new Date(0)
    d.setUTCSeconds(period.dt)
    this.ISODate = d.toISOString().slice(5, 10)
    this.dayName = _weekdaysLangs(language)[d.getDay()]
    this.iconSrc = `https://openweathermap.org/img/wn/${period.weather[0].icon || 'na'}@4x.png`
    this.maxTempF = period.temp.max || 'N/A'
    this.minTempF = period.temp.min || 'N/A'
    const s = period.weather[0].description || 'N/A'
    this.description = s.charAt(0).toUpperCase() + s.slice(1)
    this.sunrise = new Date(period.sunrise * 1000).toLocaleTimeString('en-GB').slice(0, 5)
    this.sunset = new Date(period.sunset * 1000).toLocaleTimeString('en-GB').slice(0, 5)
    this.humidity = period.humidity
    this.pressure = period.pressure
    this.wind_speed = period.wind_speed
    this.co = co
  }

  getHueColors () {
    const hueMax = (1.0 - (this.maxTempF / this.maxTemp)) * 240
    const hueMin = (1.0 - (this.minTempF / this.maxTemp)) * 240
    const hueColors = `; background: linear-gradient(70deg, hsl( ${hueMin} , 90%, 80%) 40%, hsl( ${hueMax} , 90%, 80%) 40%)`
    return hueColors
  }

  getCurrentMarkedId () {
    const currentMarkedId = 'city-' + this.currentMarked.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(' ', '-').toLowerCase()
    return `checkId${currentMarkedId}`
  }

  getColorScaleHeads () {
    const range = Array.range(this.minTemp, this.maxTemp, 0.5, 1)
    const stepMin = range.filter(n => { return this.minTempF > n }).length
    const stepMax = range.filter(n => { return this.maxTempF > n }).length
    const colorScale = range.map(step => { return `hsl( ${((1.0 - (step / this.maxTemp)) * 240)} , 90%, 80%)` })
    const heads = colorScale.map((color, idx) => {
      if (stepMin === idx) { return `<th style= 'background-color: ${color}; font-size: xx-small'>&nbsp;ᐁ</th>` }
      else if (stepMax === idx) { return `<th style= 'background-color: ${color}; font-size: xx-small'>&nbsp;ᐃ</th>` }
      else { return `<th style= 'background-color: ${color}; font-size: xx-small'>&nbsp;</th>` }
    }).join('')
    return heads
  }

  html () {
    const showClass = _isMobile ? '' : 'show'
    const collapseIcon = _isMobile ? '<i class="bi bi-arrows-collapse"></i>' : ''
    let autoDragBtn = _isMobile ? `<button class="btn-sm btn-light" id="${this.getCurrentMarkedId()}-${this.co}-autodrag" onclick="autoDrag(this.id)"><i class="bi bi-binoculars"></i></button>` : ''
    return (`
      <div class="col-md-3" id="${this.getCurrentMarkedId()}-${this.co}" style="margin-top:20px;" draggable="true" ondragstart="drag(event)">
          <div class="card" style="${this.getHueColors()}">
              <table style="width:100%">
                  <tr>${this.getColorScaleHeads()}</tr>
              </table>
              <h4 class="card-title text-center" data-toggle="collapse" href="#collapseId${this.co}" role="button" aria-expanded="false">${collapseIcon}${this.dayName}\n${this.ISODate}</h4>
              <img class="card-img mx-auto d-block" style="max-width: 40%; margin:-10% 0px -10% 0px;" src="${this.iconSrc}">
              <h5 class="card-title text-center" style="margin:0">${this.description}</h5>
              <div class="card-body">
                  <div class="collapse ${showClass}" id="collapseId${this.co}">
                      <p class="card-text text-center">▼ Low: ${this.minTempF} &nbsp;|&nbsp; ▲ High: ${this.maxTempF}</p>
                      <div id="weatherinfo">
                      <p><img class="icon" src="./img/sunrise.svg"> ${this.sunrise}</p>
                      <p><img class="icon" src="./img/sunset.svg"> ${this.sunset}</p>
                      <p><img class="icon" src="./img/humidity.svg"> ${this.humidity}</p>
                      <p><img class="icon" src="./img/pressure.svg"> ${this.pressure}</p>
                      <p><img class="icon" src="./img/wind.svg"> ${this.wind_speed}</p>
                  </div>
                  </div>
              </div>
          </div>
          ${autoDragBtn}
      </div>
    `)
  }
}

function _adsHolder(company) {
  switch (company) {
    case 'Google':
      return (`
                <div class="col-md-3" style="margin-top:20px;">
                    <div class="card" style="background-color: red;">
                        <div class="card-body">
                            <p>Ads go here</p>
                        </div>
                    </div>
                </div>
                `)
      break
    default:
      break
  }
}
