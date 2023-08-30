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
  handleSelectedFilters?: any
  getSearchPageData?: any
  projectData?: any
  state:any
  selectedFilters?:any
}
interface MyQueueModalProps {
  open: boolean
  handleClose: () => void
  loading:boolean
  handleSelectedFilters?: any
  projectData?: any
  state:any
  selectedFilters?:any
  userFacets:ReportedUser[]
  typeFacets:NotificationType[]
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
type notificationSearchState = {
  error: string
  notifications: Array<object>
  updatedFrom: string,
  updatedTo:string,
  reportedBy:string,
  type:string,
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
type taskSearchState = {
  error: string
  tasks: Array<object>
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
type notificationSearchState = {
  error: string
  notifications: Array<object>
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

type Notification = {
      key?: React.Key
      id: number,
      notificationId: number,
      sourceId: string| number |null,
      reportedBy: string,
      updatedDateTime: string,
      source: string,
      sourceName: string,
      notificationType: string |number,
      notes: string|null,
      description: string,
      type: string,
      linksCount: number,
      isRead:boolean

  
  // // notificationId?: React.Key
  // updatedDate:string,
  // projectName: string
  // description: string
  // note: string
  // reportedBy: string
  // type: string
}

type ReportedUser={
  id:string,
  name:string
}
type NotificationType={
  id:string,
  name:string
}

interface Tasks {
  key?: React.Key
  taskId: React.Key
  title: string
  prirority: string
  artistList: string
  platform: string
  batch: Number,
  progress:Number,
  startDate:string,
  endDate:string,
  status:string
}