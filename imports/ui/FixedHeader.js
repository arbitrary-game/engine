import React from "react";

export class FixedHeaderComponent extends React.Component {
  render() {
    return (
      <div className="fixed-header-component">
        {/* Rendering twice to push the content down: http://stackoverflow.com/a/6414716/303694 */}}
        {this.props.children}
      </div>
    )
  }
}

export default FixedHeaderComponent;
