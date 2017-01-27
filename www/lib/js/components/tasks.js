var React, ReactDOM, Pikaday, $, moment, Sugar, pull, Sortable, storage

let TaskList = React.createClass({
  componentDidMount () {
    Sortable.create(document.getElementById('task-list'), {
      group: 'tasks',
      animation: 150,
      handle: '.date-tag',
      onStart: (e) => {
        $('.task-delete-box').addClass('animated')
        $('.task-delete-box').addClass('visible')
      },
      onRemove: (e) => {
        let id = e.item.attributes[1].nodeValue
        storage.tasks.remove(storage.tasks.get(id))
      },
      onEnd: (e) => {
        let tasks = storage.tasks.get()
        tasks.splice(e.newIndex, 0, tasks.splice(e.oldIndex, 1)[0])
        storage.set('tasks', tasks)
        $('.task-delete-box.visible').removeClass('visible')
        $('.date-tag .fa-arrows').removeClass('fa-arrows').addClass('fa-calendar')
      }
    })
  },
  render () {
    let tasks = this.props.tasks.map((task, i) => {
      return <Task task={task} key={i} />
    })
    return (
      <ul id='task-list' className='list-group'>
        {tasks}
        <TaskDeleteBox />
      </ul>
    )
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
    if (e.keyCode === 32 || e.keyCode === 13 || e.type === 'blur') {
      if (value !== value.replace(/\B#\B/g, '')) value = element.value = value.replace(/\B#\B/g, '')
      this.setState({
        tags: this.state.tags.concat(Object.keys(matches))
      })
      element.value = value.replace(/\B#\S+ ?/g, '#')
    }
  },
  removeTags (e) {
    let element = e.nativeEvent.target.children.length ? e.nativeEvent.target : e.nativeEvent.target.parentElement
    let text = element.textContent
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
      <li className={'task list-group-item '.concat(difficulty, ' ', checked)} data-id={this.props.task.id}>
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
        <input className='task-name form-control' type='text' defaultValue={this.props.value} onKeyUp={this.props.addTags} onBlur={this.props.addTags} />
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
                    <span className='task-dropdown-item-text'>{tag}</span>
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
                  <i className='fa fa-hashtag' />{tag}<i className='fa fa-times pull-right' onClick={this.props.removeTags} />
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
    return <input className='task-date form-control text-capitalize' type='text' readOnly={/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)} defaultValue={this.props.date} ref={function (r) { t.input = r }} />
  },
  componentDidMount () {
    let pikaday = new Pikaday({
      field: this.input,
      onClose: () => {
        console.log(this.props.date)
        if (this.input.value && Sugar.Date(this.input.value).isValid().raw) {
          let countdown = (moment(pikaday.getDate()).diff(moment(), 'days') + 1)
          this.input.value = moment(pikaday.getDate()).calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: countdown + ' [Days]',
            lastDay: '[Yesterday]',
            lastWeek: Math.abs(countdown - 1) + ' [days late]',
            sameElse: 'MM/DD/YYYY'
          })
        }
        storage.tasks.setTaskProperty($(this.input).parents('.task').attr('data-id'), 'date', this.input.value)
      },
      onSelect: () => {
        if (pikaday.getDate() !== Sugar.Date.create(this.input.value)) {
          let countdown = (moment(pikaday.getDate()).diff(moment(), 'days') + 1)
          this.input.value = moment(pikaday.getDate()).calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: countdown + ' [days]',
            lastDay: '[Yesterday]',
            lastWeek: Math.abs(countdown - 1) + ' [days late]',
            sameElse: 'MM/DD/YYYY'
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

let TaskDeleteBox = React.createClass({
  componentDidMount () {
    Sortable.create(document.getElementById('task-delete-box'), {
      group: 'tasks',
      onAdd: (e) => {
        setTimeout(() => {
          e.item.parentNode.removeChild(e.item)
          e.from.appendChild(e.item)
          storage.tasks.render()
        }, 400)
      }
    })
  },
  render () {
    return <div id='task-delete-box' className='container task-delete-box' />
  }
})

storage.tasks.render = (tasks) => {
  if (!tasks) tasks = storage.tasks.get()
  ReactDOM.render(<TaskList tasks={tasks} />, $('.container')[0])
}

storage.tasks.render()
