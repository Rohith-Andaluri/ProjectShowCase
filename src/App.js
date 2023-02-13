import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from './components/Header'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Replace your code here
class App extends Component {
  state = {
    selectedId: categoriesList[0].id,
    respectiveCategoriesList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getDataFromApi()
  }

  getDataFromApi = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {selectedId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${selectedId}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        respectiveCategoriesList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetry = () => {
    this.getDataFromApi()
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader
        type="ThreeDots"
        color="#00BFFF"
        height={50}
        width={50}
        testid="loader"
      />
    </div>
  )

  renderProjects = () => {
    const {respectiveCategoriesList} = this.state
    return (
      <ul className="projects-container">
        {respectiveCategoriesList.map(eachItem => (
          <li key={eachItem.id} className="project-item">
            <img
              src={eachItem.imageUrl}
              className="project-image"
              alt={eachItem.name}
            />
            <p className="project-name">{eachItem.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  onChangeOption = event => {
    this.setState({selectedId: event.target.value}, () => this.getDataFromApi())
  }

  renderAllProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProjects()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="main-container">
          <div className="category-container">
            <select
              className="select-container"
              onChange={this.onChangeOption}
              id="categories"
            >
              {categoriesList.map(eachItem => (
                <option key={eachItem.id} value={eachItem.id}>
                  {eachItem.displayText}
                </option>
              ))}
            </select>
            {this.renderAllProjects()}
          </div>
        </div>
      </>
    )
  }
}

export default App
