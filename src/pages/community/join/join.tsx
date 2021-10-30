import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';

import Categories from './categories/categories';
import Skills from './skills/skills';
import { resetJoinCommunityState } from './store/join.reducer';
import './join.scss';
import Communities from './communities/communities';
import UserInfo from './user-info/user-info';

const Join = (props) => {
  const dispatch = useDispatch();
  useEffect(
    () => () => {
      dispatch(resetJoinCommunityState());
    },
    [dispatch]
  );
  return (
    <div className="sw-join-community-container">
      <Route path="/join-community/user-info" component={UserInfo} {...props} />
      <Route path="/join-community/categories" component={Categories} {...props} />
      <Route path="/join-community/skills" component={Skills} {...props} />
      <Route path="/join-community/communities" component={Communities} {...props} />
    </div>
  );
};

export default Join;
