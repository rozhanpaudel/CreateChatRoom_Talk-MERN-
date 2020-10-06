import React, { Component } from 'react';
import './imageSelect.css';

export default class ImageSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      options: this.props.options,
      search: '',
      filteredOptions: [],
    };
  }

  componentDidMount() {
    if (this.props.clear) this.setState({ search: '' });
  }

  handleChange = (e) => {
    this.setState({ search: e.target.value });
    console.log(e.target.value);
  };

  handleChoose = (obj) => {
    this.setState({
      search: obj.name,
    });
    this.props.handleImageSelect(obj);
  };

  render() {
    //logic
    var filteredOptions = this.state.options.filter((person) => {
      return person.name
        .toLowerCase()
        .includes(this.state.search.toLowerCase());
    });

    var displayPersons = this.state.search ? (
      <div style={{ width: '250px' }}>
        {filteredOptions.map((obj, i) => {
          return (
            <div
              style={{
                backgroundColor: 'white',
                color: ' green',
              }}
              className='searchuser__list'
              onClick={() => this.handleChoose(obj)}>
              <img
                src={obj.image}
                style={{
                  height: '35px',
                  width: '35px',
                  borderRadius: '50%',
                }}></img>
              <span>
                {obj.name} <br />({obj.qualification})
              </span>
            </div>
          );
        })}
      </div>
    ) : null;

    return (
      <div>
        <input
          className='form-control'
          placeholder='Search'
          name='search'
          value={this.props.value || this.state.search}
          onChange={this.handleChange}></input>
        {displayPersons}
      </div>
    );
  }
}
