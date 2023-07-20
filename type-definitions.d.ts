// declare module './index.module.css'
declare module '*.module.css'
declare module '*.png'

interface Project {
  key?: React.Key
  projectId: React.Key
  title: string
  artistList: string
  platformName: string
  teamName: string
  statusTypeDescription: string
  progress: number
  startDate: string
  endDate: string
  notes: string
  updatedOn: string
}

interface Platform {
  platformId: number
  platformName: string
}
interface Teams {
  teamId: number
  teamName: string
}
interface Status {
  statusTypeId: number
  statusTypeDescription: string
}

interface ModalProps {
  open: boolean
  platformFacets: Platform[]
  teamFacets: Teams[]
  statusFacets: Status[]
  handleClose: () => void
  loading:boolean
  handleFlterModalSubmit?: any
  getSearchPageData?: any
  projectData?: any
  state:any
}

type searchState = {
  error: string
  projects: Array<object>
  platforms: number |null
  teams: number | null
  status:number | null
  platformFacets: Platform[]
  teamFacets: Teams[]
  statusFacets:Status[]
  startDate: string
  endDate: string
  totalPages: number
  totalItems: number
  pageNumber: number
    searchTerm: string,
  itemsPerPage: string,
  sortColumns: string,
  sortOrder: string,
  searchWithin: string[],
  tableSearch:object,
}
