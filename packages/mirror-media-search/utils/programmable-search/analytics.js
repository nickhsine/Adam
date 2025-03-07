import ReactGA from 'react-ga'
import { GA_TRACKING_ID } from '../../config'

export const initGA = () => {
  // console.log('GA init')
  ReactGA.initialize(GA_TRACKING_ID)
}

export const logPageView = () => {
  // console.log(`Logging pageview for ${window.location.pathname}`)
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

export const logGAEvent = (action = '', label = '') => {
  if (action) {
    ReactGA.event({
      action,
      label,
      category: 'search',
    })
  }
}

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal })
  }
}
