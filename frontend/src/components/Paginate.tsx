import React from "react";

//boostrap stuff
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

interface PaginateProps {
  pages: number,
  page: number
}

const Paginate: React.FC<PaginateProps> = ({ pages, page }) => {
  return (
    pages > 1 ? (
      <Pagination>
        <Pagination.Prev />
        {/* turn pages into an array, map through their keys ... key will be one behind pages, since indexes start at 0*/}
        {/* //the link puts the param in to the url, picked up by the query and sent to controller. */}
        {[...Array(pages).keys()].map((num) => (
           
          <LinkContainer
            key={num + 1}
            to={`/teams/page/${num + 1}`}
          >
            <Pagination.Item active = {num + 1 === page}>{num+1}</Pagination.Item>
          </LinkContainer>
        ))}
        <Pagination.Next />
      </Pagination>
    ) : null
  );
};

export default Paginate;