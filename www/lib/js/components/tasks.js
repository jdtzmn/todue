var React, ReactDOM, Pikaday, $, moment, Sugar, pull

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
      difficulty: this.props.task.difficulty,
      checked: this.props.task.checked,
      tags: this.props.task.tags
    }
  },
  difficultyChange (e) {
    this.setState({
      difficulty: e.target.value
    })
  },
  checkboxChange (e) {
    this.setState({
      checked: e.target.checked
    })
  },
  addTags (e) {
    let element = e.nativeEvent.srcElement
    let value = element.value
    let regex = /\B#(\S+)/g
    let matches = {}
    let match = regex.exec(value)
    while (match !== null) {
      matches[match[1]] = match[0]
      match = regex.exec(value)
    }
    if (e.keyCode === 32 || e.keyCode === 13 || e.keyCode === 9) {
      value = element.value = value.replace(/\B#\B/g, '')
      this.setState({
        tags: this.state.tags.concat(Object.keys(matches))
      })
      element.value = value.replace(/\B#\S+ ?/g, '#')
    }
  },
  removeTags (e) {
    let element = e.nativeEvent.target.children.length ? e.nativeEvent.target : e.nativeEvent.target.parentElement
    let text = element.textContent.slice(0, -1)
    if (!e.keyCode || e.keyCode === 8) {
      $(element).next().length ? $(element).next().prev().focus() : $(element).prev().focus()
      this.setState({
        tags: pull(this.state.tags, text)
      })
    } else if (e.keyCode === 39) {
      $(element).next('.task-tag').focus()
    } else if (e.keyCode === 37) {
      $(element).prev('.task-tag').focus()
    } else if (e.keyCode === 9) {
      e.shiftKey ? $('.task-tag').first().focus() : $('.task-tag').last().focus()
    }
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

    let checked = this.state.checked ? 'task-checked' : ''

    return (
      <li className={'task list-group-item '.concat(difficulty, ' ', checked)}>
        <div className='task-input input-group'>
          <TaskCheckbox checked={this.props.task.checked} uuid={this.props.task.id} change={this.checkboxChange} />
          <TaskInput value={this.props.task.name} uuid={this.props.task.id} addTags={this.addTags} />
          <TaskTagList tags={this.state.tags} removeTags={this.removeTags} />
          <TaskDate date={this.props.task.date} />
          <div className='input-group-addon date-tag'>
            <i className='fa fa-calendar' />
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
        <input id={this.props.uuid} onChange={this.props.change} type='checkbox' defaultChecked={this.props.checked} />
        <label htmlFor={this.props.uuid} />
      </div>
    )
  }
})

let TaskInput = React.createClass({
  render () {
    return (
      <div className='task-input-group'>
        <input className='task-name form-control' type='text' defaultValue={this.props.value} onKeyUp={this.props.addTags} />
      </div>
    )
  }
})

let TaskTagList = React.createClass({
  render () {
    return this.props.tags.length ? (
      <div className='task-tag-list-container'>
        <div className='dropdown task-dropdown hidden-lg-up'>
          <i className='fa fa-tags dropdown-toggle' data-toggle='dropdown' />
          <div className='dropdown-menu'>
            {
              this.props.tags.map((tag, i) => {
                return (
                  <div className='dropdown-item task-dropdown-item' key={i}>
                    <span className='task-dropdown-item-text'>{tag} </span>
                    <i className='fa fa-times pull-right' onClick={this.props.removeTags} />
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className='hidden-md-down task-tag-list-flex'>
          {
            this.props.tags.map((tag, i) => {
              return (
                <button className='task-tag input-group-addon bg-primary' onKeyDown={this.props.removeTags} onClick={(e) => { e.preventDefault() }} key={i}>
                  <i className='fa fa-hashtag' />{tag} <i className='fa fa-times' onClick={this.props.removeTags} />
                </button>
              )
            })
          }
        </div>
      </div>
    ) : null
  }
})

let TaskDate = React.createClass({
  render () {
    let t = this
    let date = Sugar.Date(this.props.date).isValid().raw ? moment(Sugar.Date(this.props.date)).calendar(null, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'DD/MM/YYYY'
    }) : this.props.date
    return <input className='task-date form-control' type='text' readOnly={/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)} defaultValue={date} ref={function (r) { t.input = r }} />
  },
  componentDidMount () {
    let pikaday = new Pikaday({
      field: this.input,
      onClose: () => {
        if (this.input.value && Sugar.Date(this.input.value).isValid().raw) {
          this.input.value = moment(pikaday.getDate()).calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'DD/MM/YYYY'
          })
        } else {
          this.input.value = this.input.value.charAt(0).toUpperCase() + this.input.value.slice(1)
        }
      },
      onSelect: () => {
        if (pikaday.getDate() !== Sugar.Date.create(this.input.value)) {
          this.input.value = moment(pikaday.getDate()).calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'DD/MM/YYYY'
          })
        }
      }
    })

    $(this.input).on('input', () => {
      let val = this.input.value
      if (Sugar.Date(this.input.value).isValid().raw) {
        pikaday.setDate(Sugar.Date.create(val))
        this.input.value = val
      }
    }).click(() => {
      this.input.select()
    })
    pikaday
  }
})

ReactDOM.render(<TaskList tasks={[
  {
    id: '640dd626-b189-11e6-80f5-76304dec7eb7',
    name: 'P.130#1-7',
    checked: false,
    tags: ['Hard', 'Math', 'Reading', 'Books', 'Really Long One', 'Really Really Long One', 'Impossibly Long One'],
    difficulty: 1,
    date: 'Tomorrow'
  },
  {
    id: 'b5271a60-b18c-11e6-80f5-76304dec7eb7',
    name: 'Clean the car',
    checked: true,
    tags: ['Chores'],
    difficulty: 2,
    date: undefined
  }
]} />, $('.container')[0])
