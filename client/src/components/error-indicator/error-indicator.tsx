import React, { Component } from "react";
import { Message } from "semantic-ui-react";

interface IErrorIndicatorProps {
  message: string;
}

class ErrorIndicator extends Component<IErrorIndicatorProps> {
  public static defaultProps = {
    message: "There is nothing to display"
  };

  public render() {
    const { message } = this.props;
    return (
      <Message negative>
        <Message.Header>There are no available routes</Message.Header>
        <p>{message}</p>
      </Message>
    );
  }
}

export default ErrorIndicator;
