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