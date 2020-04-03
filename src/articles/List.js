import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

import './List.css';

class List extends Component {  constructor(props) {
    super(props);
    this.state = {
      data: null,
      dataSearch: null,
      loading: false,
      error: null,
    };
  }

  async fetch() {
    try {
      await new Promise(res => this.setState({
        loading: true,
      }, res));
      let result = await fetch(`/api/articles/`);
      if(result.status !== 200) {
        this.setState({
          loading: false,
          error: await result.text(),
        });
        return;
      }
      let json = await result.json();
      this.setState({
        loading: false,
        error: null,
        data: json.articles,
      });
    } catch(e) {
      this.setState({
        loading: false,
        error: e,
      });
    }
  }

  componentWillMount() {
    this.fetch();
  }

  updateSearch(ev) {

    this.setState({
      loading: true,
    }, async () => {
      let searchWord = "France";
     // Post JSON string to MongoDB
      let result = await fetch('/api/articles/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchWord: searchWord,

        }),
      });
      let json = await result.json();
        document.getElementById("dataSearch").innerHTML = "Option 2 has changed this DIV tag's content";

      this.setState({
        loading: false,
        error: null,
        dataSearch: json.articles,
      });

  });

  }

  render() {
    if(this.state.error) {
      return <div>{this.state.error.toString()}</div>;
    }
    if(this.state.loading) {
      return <div>Loading</div>;
    }
    return (
      <React.Fragment>
        <div>
          <Button tag={Link} to='/articles/create'>Create a new Article</Button>
        </div>
        <ul className='ArticleList'>
          {this.state.data.map(article =>
            <li key={article._id}>
              <div>{new Date(article.created).toLocaleDateString()}</div>
              <Link to={`/articles/${article._id}/`}>
                <h4>{article.title}</h4>
              </Link>
              <div>{article.content}</div>
            </li>
          )}
        </ul>

        <div id="SearchContent">

        <FormGroup row>
          <Label for="search" sm={2}>Search</Label>
          <Col sm={10}>
            <Input
              type="input"
              name="search"
              id="search"
              placeholder="Search Territories"
              onChange={e => this.updateSearch()}
              value={this.state.search}
              disabled={this.state.loading} />
          </Col>
        </FormGroup>

          <div id="dataSearch"></div>

        </div>
      </React.Fragment>
    );
  }
}

export default List;
