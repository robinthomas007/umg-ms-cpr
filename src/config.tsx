export function cprUrls(env: string) {
  const cpr_app_urls: any = {
    url: 'https://api.dev.cpr-portal.umgapps.com/gateway/cpr/',
  }
  // eslint-disable-next-line default-case
  switch (env) {
    case 'qa':
      cpr_app_urls.url = 'https://api.qa.cpr-portal.umgapps.com/gateway/cpr/'
      return cpr_app_urls
    case 'dev':
      cpr_app_urls.url = 'https://api.dev.cpr-portal.umgapps.com/gateway/cpr/'
      return cpr_app_urls
    case 'uat':
      cpr_app_urls.url = 'https://api.stage.cpr-portal.umgapps.com/gateway/cpr/'
      return cpr_app_urls
    case 'prod':
      cpr_app_urls.url = 'https://api.cpr-portal.umgapps.com/gateway/cpr/'
      return cpr_app_urls
    default:
      return 'https://api.dev.cpr-portal.umgapps.com/gateway/cpr/'
  }
}
