var React, ReactDOM, Pikaday, $

let TaskList = React.createClass({
  render () {
    let tasks = this.props.tasks.map((task, i) => {
      return <Task task={task} key={i} />
    })
    return <ul className='list-group'>{tasks}</ul>
  }
})

let Task = React.createClass({
  getInitialState () {
    return {
      difficulty: this.props.task.difficulty
    }
  },
  difficultyChange (e) {
    this.setState({
      difficulty: e.target.value
    })
  },
  render () {
    let difficulty = (() => {
      switch (+this.state.difficulty) {
        case 1:
          return 'dif-easy'
        case 2:
          return 'dif-medium'
        case 3:
          return 'dif-hard'
      }
    })()
    return (
      <li className={'task list-group-item '.concat(difficulty)}>
        <div className='task-input input-group'>
          <div className='task-row'>
            <TaskCheckbox uuid={this.props.task.id} />
            <TaskInput value={this.props.task.name} />
            <TaskCollapse />
          </div>
          <div className='task-collapse collapse'>
            <TaskTagList tags={this.props.task.tags} />
            <div className='task-row'>
              <TaskDifficultySelect change={this.difficultyChange} uuid={this.props.task.id} difficulty={this.state.difficulty} />
              <TaskDate date={this.props.task.date} />
              <div className='input-group-addon date-tag'>
                <i className='fa fa-calendar' />
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }
})

let TaskCheckbox = React.createClass({
  render () {
    return (
      <div className='animated-checkbox task-checkbox'>
        <input id={this.props.uuid} type='checkbox' />
        <label htmlFor={this.props.uuid} />
      </div>
    )
  }
})

let TaskInput = React.createClass({
  render () {
    return <input className='task-name form-control' type='text' defaultValue={this.props.value} />
  }
})

let TaskCollapse = React.createClass({
  render () {
    return (
      <button className='input-group-addon task-row-collapse'>
        <i className='fa fa-chevron-down' />
      </button>
    )
  }
})

let TaskTagList = React.createClass({
  render () {
    let tags = this.props.tags.map((tag, i) => {
      return <TaskTag name={tag} keypress={this.keypress} key={i} />
    })
    if (tags.length) return <div className='task-row'>{tags}</div>
    return null
  }
})

let TaskTag = React.createClass({
  render () {
    return (
      <button className='input-group-addon bg-primary task-tag' onKeyDown={this.props.keypress} onClick={(e) => { e.preventDefault() }}>
        {this.props.name} <i className='fa fa-times' />
      </button>
    )
  }
})

let TaskDifficultySelect = React.createClass({
  render () {
    return (
      <div className='input-group-addon bg-primary difficulty-tag'>
        <div className='abc-radio abc-radio-success'>
          <input type='radio' onChange={this.props.change} name={this.props.uuid} defaultValue='1' defaultChecked={this.props.difficulty === 1} />
          <label />
        </div>
        <div className='abc-radio abc-radio-warning'>
          <input type='radio' onChange={this.props.change} name={this.props.uuid} defaultValue='2' defaultChecked={this.props.difficulty === 2} />
          <label />
        </div>
        <div className='abc-radio abc-radio-danger'>
          <input type='radio' onChange={this.props.change} name={this.props.uuid} defaultValue='3' defaultChecked={this.props.difficulty === 3} />
          <label />
        </div>
      </div>
    )
  }
})

let TaskDate = React.createClass({
  render () {
    let t = this
    return <input className='task-date form-control' type='text' defaultValue={this.props.date} ref={function (r) { t.input = r }} />
  },
  componentDidMount () {
    let pikaday = new Pikaday({
      field: this.input,
      theme: 'dark-theme',
      onOpen: () => {
        this.input.value = (new Date()).toDateString()
      }
    })
    pikaday
  }
})

ReactDOM.render(<TaskList tasks={[
  {
    id: '640dd626-b189-11e6-80f5-76304dec7eb7',
    name: 'P.130#1-7',
    tags: ['Hard', 'Math', 'Reading'],
    difficulty: 1,
    date: '1 Week'
  },
  {
    id: 'b5271a60-b18c-11e6-80f5-76304dec7eb7',
    name: '',
    tags: [],
    difficulty: undefined,
    date: undefined
  }
]} />, $('.container')[0])
