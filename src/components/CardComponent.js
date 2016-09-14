/**
 * Created by moriyasei on 2016/09/14.
 */
import React, { PropTypes } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const CardComponent = ({
  title,
  subtitle,
  children
}) => (
  <Card>
    <CardHeader
      title={title}
      subtitle={subtitle}
    />
    <CardText>
      {children}
    </CardText>
  </Card>
);

CardComponent.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default CardComponent;

