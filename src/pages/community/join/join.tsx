import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import Categories from "./categories/categories";
import Skills from "./skills/skills";
import { resetJoinCommunityState } from "./store/join.reducer";
import "./join.scss";

const Join = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      console.log('heree dispatched');
      dispatch(resetJoinCommunityState());
    };
  }, [dispatch]);
  return (
    <div className="sw-join-community-container">
      <Redirect from="/join-community" to={`/join-community/categories`} />
      <Route
        path={`/join-community/categories`}
        component={Categories}
        {...props}
      />
      <Route
        path={`/join-community/skills`}
        component={Skills}
        {...props}
      />
      <Route
        path={`/join-community/pick-community`}
        component={Skills}
        {...props}
      />
    </div>
  );
};

export default Join;
