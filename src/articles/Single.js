import React, { Component } from 'react';
import {
  Link,
} from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

class Single extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      title: '',
      content: '',
      territory: '',
      territoryUK: false,
      territoryFrance: false,
      errors: {},
    };
  }

  updateTitle(ev) {
    if(this.state.loading) return;
    this.setState({
      title: ev.target.value,
    });
  }

  updateContent(ev) {
    if(this.state.loading) return;
    this.setState({
      content: ev.target.value,
    });
  }

  //For some reason using the old function format not working
  updateTerritoryUK = () => {
    this.setState(prevState => ({
      territoryUK: !prevState.territoryUK,
    }));
  }

  updateTerritoryFrance = () => {
    this.setState(prevState => ({
      territoryFrance: !prevState.territoryFrance,
    }));
  }

  async fetch(id) {
    if(!id) {
      id = this.props.match.params.articleId;
    }
    try {
      await new Promise(res => this.setState({
        loading: true,
      }, res));
      let result = await fetch(`/api/articles/${id}/`);
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
        id: json.article._id,
        title: json.article.title,
        content: json.article.content,
        territory: json.article.territory,

      });

      // Setup Territories
      let territories = this.state.territory.split(',');
      for (const [, value] of territories.entries()) {
          this.setState({
            [value]: true,
          });
      }

    } catch(e) {
      this.setState({
        loading: false,
        error: e,
      });
    }
  }

  submit() {
    let territories = [];

    this.setState({
      loading: true,
    }, async () => {
      // Setup Variables
      for (var key in this.state) {
        // We know it's a checkbox for the territories
        if(this.state[key] === true && key !== "loading") {
          territories.push(key);
        }
      }

      let result = await fetch(`/api/articles/${this.state.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: this.state.title,
          content: this.state.content,
          territory: territories.toString(),
        }),
      });
      if(result.status !== 200) {
        this.setState({
          loading: false,
          error: await result.text(),
        });
        return;
      }
      let json = await result.json();
      if(json.success) {
        this.props.history.push('/');
      } else {
        this.setState({
          loading: false,
          errors: json.errors,
        });
      }
    });
  }


  componentWillMount() {
    this.fetch();
  }

  componentWillReceiveProps(newProps) {
    if(this.props.match.params.articleId !== newProps.match.params.articleId) {
      this.fetch(newProps.match.params.articleId);
    }
  }

  render() {
    if(this.state.error) {
      return <div>{this.state.error.toString()}</div>;
    }
    return (
      <Form>
        <FormGroup row>
          <Label for="title" sm={2}>Title</Label>
          <Col sm={10}>
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="Title"
              sm={10}
              onChange={e => this.updateTitle(e)}
              value={this.state.title}
              disabled={this.state.loading}
              invalid={this.state.errors.title} />
            {
              this.state.errors.title ?
                <FormFeedback>{this.state.errors.title.message}</FormFeedback>
              : ''}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="content" sm={2}>Content</Label>
          <Col sm={10}>
            <Input
              type="textarea"
              name="content"
              id="content"
              placeholder="Article Content"
              onChange={e => this.updateContent(e)}
              value={this.state.content}
              disabled={this.state.loading} />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label sm={2}>Territories</Label>
          <Label for="territoryUK" sm={3}>United Kingdom</Label>
          <Col sm={2}>
            <Input
              type="checkbox"
              checked={this.state.territoryUK}
              name="territoryUK"
              id="territoryUK"
              onChange={this.updateTerritoryUK}
             />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label sm={2}></Label>
          <Label for="territoryFrance" sm={3}>France</Label>
          <Col sm={2}>
            <Input
              type="checkbox"
              checked={this.state.territoryFrance}
              name="territoryFrance"
              id="territoryFrance"
              onChange={this.updateTerritoryFrance}
             />
          </Col>
        </FormGroup>

        <FormGroup check row>
          <Col sm={{ size: 10, offset: 2 }}>
            <Button onClick={() => this.submit()}  disabled={this.state.loading}>Submit</Button>
            <Button tag={Link} to='/' disabled={this.state.loading}>Cancel</Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export default Single;
