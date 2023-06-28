export function cprUrls(env: string) {
  const cpr_app_urls = {
    url: 'https://api.dev.cpr.umgapps.com/api/',
    widgetUrl: 'https://party-qa.gr4o-nonprod.umusic.net/party-workspace/search',
    apiUrl: 'https://party-qa.gr4o-nonprod.umusic.net/party-api',
  }
  // eslint-disable-next-line default-case
  switch (env) {
    case 'qa':
      cpr_app_urls.url = 'https://api.dev.cpr.umgapps.com/api/'
      cpr_app_urls.widgetUrl = 'https://party-qa.gr4o-nonprod.umusic.net/party-workspace/search'
      cpr_app_urls.apiUrl = 'https://party-qa.gr4o-nonprod.umusic.net/party-api'
      return cpr_app_urls
    case 'dev':
      cpr_app_urls.url = 'https://api.dev.cpr-portal.umgapps.com/gateway/cpr/'
      cpr_app_urls.widgetUrl = 'https://party-qa.gr4o-nonprod.umusic.net/party-workspace/search'
      cpr_app_urls.apiUrl = 'https://party-qa.gr4o-nonprod.umusic.net/party-api'
      return cpr_app_urls
    case 'uat':
      cpr_app_urls.url = 'https://api.uat.cpr.umgapps.com/api/'
      cpr_app_urls.widgetUrl = 'https://party-qa.gr4o-nonprod.umusic.net/party-workspace/search'
      cpr_app_urls.apiUrl = 'https://party-qa.gr4o-nonprod.umusic.net/party-api'
      return cpr_app_urls
    case 'prod':
      cpr_app_urls.url = 'https://api.cpr.umgapps.com/api/'
      cpr_app_urls.widgetUrl = 'https://party-prod.gr4o.umusic.net/party-workspace/search'
      cpr_app_urls.apiUrl = 'https://party-prod.gr4o.umusic.net/party-api'
      return cpr_app_urls
  }
}
