var React, ReactDOM, Pikaday, $, pull

/*
let NewTaskTag = React.createClass({
  propTypes: {
    keypress: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired
  },
  render: function () {
    return <button className='input-group-addon new-task-tag bg-warning' onKeyDown={this.props.keypress} onClick={(e) => { e.preventDefault() }}>{this.props.name} <i className='fa fa-times' onClick={this.props.keypress} /></button>
  }
})

let NewTaskInput = React.createClass({
  keypress: function (e) {
    let element = e.nativeEvent.target.children.length ? e.nativeEvent.target : e.nativeEvent.target.parentElement
    let text = element.textContent.slice(0, -1)
    if (!e.keyCode || e.keyCode === 8) {
      $(element).next().length ? $(element).next().prev().focus() : $(element).prev().focus()
      this.setState({
        tags: pull(this.state.tags, text)
      })
    } else if (e.keyCode === 39) {
      $(element).next('.new-task-tag').focus()
    } else if (e.keyCode === 37) {
      $(element).prev('.new-task-tag').focus()
    } else if (e.keyCode === 9) {
      e.shiftKey ? $('.new-task-tag').first().focus() : $('.new-task-tag').last().focus()
    }
  },
  tag: function (e) {
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
  getInitialState: function () {
    return {
      tags: []
    }
  },
  render: function () {
    return (
      <div className='new-task-group'>
        <div className='input-group new-task-input-group'>
          <input className='form-control new-task-name' type='text' placeholder='Task Name' autoFocus='true' onKeyUp={this.tag} />
          {
            this.state.tags.map((tag, i) => {
              return <NewTaskTag name={tag} keypress={this.keypress} key={i} />
            })
          }
        </div>
      </div>
    )
  }
})

let NewTaskDifficultyDropdown = React.createClass({
  render: function () {
    return (
      <div className="difficulty-wrapper">
        <select className='form-control difficulty'>
          <option defaultValue>Difficulty</option>
          <option value='1'>Easy</option>
          <option value='2'>Medium</option>
          <option value='3'>Hard</option>
        </select>
      </div>
    )
  }
})

let NewTaskPickaday = React.createClass({
  render () {
    let t = this
    return (
      <div className='date-group input-group'>
        <input className='form-control date' type='text' placeholder='Date' ref={function (r) { t.input = r }} />
        <div className='input-group-addon'><i className='fa fa-calendar' /></div>
      </div>
    )
  },
  componentDidMount () {
    let pikaday = new Pikaday({
      field: this.input,
      theme: 'dark-theme',
      onOpen: () => {
        this.input.value = (new Date()).toDateString()
      },
      onClose: () => {
        $('.new-task-form').submit()
      }
    })
    pikaday
  }
})

let NewTaskButton = React.createClass({
  render () {
    return (
      <button className='form-control btn btn-primary new-task-button' type='submit'>Add Task</button>
    )
  }
})

let Navbar = React.createClass({
  render () {
    return (
      <div className='new-task-flex'>
        <NewTaskInput />
        <NewTaskDifficultyDropdown />
        <NewTaskPickaday />
        <NewTaskButton />
      </div>
    )
  }
})

ReactDOM.render(<Navbar />, $('.new-task-form')[0])
*/
