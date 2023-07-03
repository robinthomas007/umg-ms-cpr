type searchState = {
  loading: Boolean
  exportLoading: Boolean
  error: string
  projects: Array<object>
  platforms: number
  teams: number
  platformFacets: Array<object>
  teamFacets: Array<object>
  statusFacets: Array<object>
  startDate: string
  endDate: string
  totalPages: number
  totalItems: number
  pageNumber: number
  searchCriteria: any
}

type searchActions = {
  type: string
  payload: any
}
// {
//   "SearchWithin":"ALL",
//   "Platforms":2,
//   "Teams":1,
//   "Status":3,
//   "StartDate":"01-01-1989",
//   "EndDate":"01-10-2023",

//   "SearchTerm":"",
//   "ItemsPerPage":"10",
//   "PageNumber":"1",
//   "SortColumns":"updatedDate",
//   "SortOrder":""
// }

export const searchInitialState = {
  loading: true,
  exportLoading: false,
  error: '',
  projects: [],
  platforms: 1,
  teams: 1,
  platformFacets: [{}],
  teamFacets: [{}],
  statusFacets: [{}],
  startDate: '',
  endDate: '',
  totalPages: 0,
  totalItems: 0,
  pageNumber: 1,
  searchCriteria: {
    searchTerm: '',
    itemsPerPage: '10',
    pageNumber: '1',
    sortColumns: 'updatedDate',
    sortOrder: '',
    filter: {
      searchWithin: ['ALL'],
    },
    tableSearch: {},
  },
}

export const searchReducer = (state: searchState, action: searchActions) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        projects: action.payload.projects,
        totalPages: Number(action.payload.totalPages),
        totalItems: Number(action.payload.totalItems),
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: false,
        projects: [],
        totalPages: 0,
        totalItems: 0,
      }
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      }
    case 'CHANGE_LIMIT':
      return {
        ...state,
        loading: true,
        searchCriteria: { ...state.searchCriteria, itemsPerPage: action.payload },
        limit: Number(action.payload),
      }
    case 'SORT_CHANGE':
      return {
        ...state,
        loading: true,
        searchCriteria: {
          ...state.searchCriteria,
          sortColumn: action.payload.sortColumn,
          sortOrder: action.payload.sortOrder,
        },
      }
    case 'PAGE_CHANGE':
      return {
        ...state,
        loading: true,
        searchCriteria: { ...state.searchCriteria, pageNumber: action.payload.pageNumber.toString() },
        pageNumber: action.payload.pageNumber,
      }
    case 'SET_SEARCH':
      return {
        ...state,
        loading: true,
        searchCriteria: {
          ...state.searchCriteria,
          searchTerm: action.payload.searchTerm,
          sortColumn: action.payload.sortColumn,
          filter: action.payload.filter,
          pageNumber: '1',
        },
        pageNumber: 1,
      }
    case 'SET_SEARCH_TABLE':
      return {
        ...state,
        loading: true,
        searchCriteria: {
          ...state.searchCriteria,
          tableSearch: action.payload.tableSearch,
          searchTerm: action.payload.searchTerm,
          filter: action.payload.filter,
          pageNumber: '1',
        },
        pageNumber: 1,
      }
    case 'SET_FACETS':
      return {
        ...state,
        loading: false,
        platformFacets: action.payload.platformFacets,
        teamFacets: action.payload.teamFacets,
        statusFacets: action.payload.statusFacets,
      }
    case 'SET_FILTER':
      return {
        ...state,
        loading: true,
        searchCriteria: {
          ...state.searchCriteria,
          searchTerm: action.payload.searchTerm,
          filter: action.payload.filter,
          pageNumber: '1',
        },
        pageNumber: 1,
      }
    case 'DELETE_SUCCESS':
      return {
        ...state,
        projects: state.projects.filter((track: any) => !action.payload.includes(track.trackId)),
      }
    case 'EXPORT_START':
      return {
        ...state,
        exportLoading: true,
        loading: true,
      }
    case 'EXPORT_END':
      return {
        ...state,
        exportLoading: false,
        loading: false,
      }
    default:
      return state
  }
}
