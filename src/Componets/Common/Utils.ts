import getCookie from './cookie'
import jwt_decode from 'jwt-decode'
import { BASE_URL } from './../../App'
import axios from 'axios'
import { ADMIN, TEAM_ADMIN, TEAM_MEMBER } from './StaticDatas'
import moment from 'moment'

export const getUsername = () => {
  try {
    const token = getCookie('cpr_portal')
    let user: { name: string } = jwt_decode(token)
    return user.name
  } catch (err) {
    console.log('Error getting Token', err)
  }
}
export const countValues = [
  {
    value: '10',
    label: '10',
  },
  {
    value: '25',
    label: '25',
  },
  {
    value: '50',
    label: '50',
  },
  {
    value: '100',
    label: '100',
  },
]
export const config = {
  headers: {
    cpr_portal: getCookie('cpr_portal'),
  },
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function FormatPlatforms(string) {
  let strArr = string.split(',')
  for (let i = 0; i < strArr.length; i++) {
    if (strArr[i] === 'youtube') {
      strArr[i] = 'YouTube'
    } else {
      strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1)
    }
  }
  return strArr ? strArr.join(', ') : ''
}

// export const ADMIN = '4d460fe7-b447-454c-bb0d-7f60797a74a0'
export const USER = '7ac0853c-8182-42cc-b034-9e4804144f75'

export const getApi = (params, url) => {
  return axios
    .get(BASE_URL + url, {
      params: params,
      headers: {
        cpr_portal: getCookie('cpr_portal'),
      },
    })
    .then((res) => {
      return res.data
    })
}

export const isSessionExpired = (err) => {
  try {
    const ErrStatus = JSON.parse(JSON.stringify(err))
    if (ErrStatus.status === 403 || ErrStatus.status === 401) {
      alert('Session Expired..!')
      window.location.reload()
    }
  } catch {
    console.log('Error in isSessionExpired method')
  }
}
export function deepClone(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  let clonedObj: any = Array.isArray(obj) ? [] : {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key])
    }
  }

  return clonedObj
}

export function removeEmptyAttributes(obj) {
  const newObj = {}

  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      newObj[key] = obj[key]
    }
  }

  return newObj
}

export const restrictUser = (role) => {
  return role === ADMIN || role === TEAM_ADMIN || role === TEAM_MEMBER ? false : true
}


export const monthCalendar = () => {
  const months: any = [];
  const currentYear = new Date().getFullYear();
  for (let month = 0; month < 12; month++) {
    const date = new Date(currentYear, month, 1);
    const monthLabel = date.toLocaleString('default', { month: 'long' });
    const yearLabel = currentYear;

    const monthObject = {
      value: `${monthLabel} ${yearLabel}`,
      label: `${monthLabel} ${yearLabel}`,
    };

    months.push(monthObject);
  }
  return months
}

export const getWeekNumber = (date) => {
  date = Number(date)
  if (date < 8) {
    return 1
  } else if (date > 7 && date < 15) {
    return 2
  }
  else if (date > 14 && date < 21) {
    return 3
  }
  else if (date > 20 && date < 28) {
    return 4
  }
  else if (date > 27) {
    return 5
  }
}

export const weekCalendar = (currentMonth?) => {
  const today = moment();
  if (!currentMonth) {
    currentMonth = today.month();
  } else {
    currentMonth = monthCalendar().findIndex((month) => month.value === currentMonth)
  }
  return [
    {
      value: '1',
      label: `Week of ${currentMonth + 1}/1 - ${currentMonth + 1}/7`,
    },
    {
      value: '2',
      label: `Week of ${currentMonth + 1}/8 - ${currentMonth + 1}/14`,
    },
    {
      value: '3',
      label: `Week of ${currentMonth + 1}/15 - ${currentMonth + 1}/21`,
    },
    {
      value: '4',
      label: `Week of ${currentMonth + 1}/22 - ${currentMonth + 1}/28`,
    },
    {
      value: '5',
      label: `Week of ${currentMonth + 1}/28 - ${currentMonth + 1}/31`,
    },
  ]
}

export const calculateWeekDates = (selectedValue, month) => {
  selectedValue = Number(selectedValue)
  const today = moment();
  let currentMonth = today.month();
  if (month) {
    currentMonth = monthCalendar().findIndex((item) => item.value === month)
  }
  const currentYear = today.year();

  const startOfMonth = moment([currentYear, currentMonth]);

  let startOfWeek;

  if (selectedValue === 1) {
    startOfWeek = moment(startOfMonth).startOf('week');
  }
  if (selectedValue === 2) {
    startOfWeek = moment(startOfMonth).add(1, 'weeks').startOf('week');
  }
  if (selectedValue === 3) {
    startOfWeek = moment(startOfMonth).add(2, 'weeks').startOf('week');
  }
  if (selectedValue === 4) {
    startOfWeek = moment(startOfMonth).add(3, 'weeks').startOf('week');
  }
  if (selectedValue === 5) {
    startOfWeek = moment(startOfMonth).add(4, 'weeks').startOf('week');
  }

  const endOfWeek = moment(startOfWeek).endOf('week'); // End of the week

  return {
    startDate: startOfWeek.format('YYYY-MM-DD'),
    endDate: endOfWeek.format('YYYY-MM-DD'),
  };
}
