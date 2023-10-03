import React, { forwardRef } from "react";
import {
    Typeahead,

} from "react-bootstrap-typeahead";
import PropsType from "prop-types";

const TypeaheadTT = forwardRef((propsFull, ref) => {
    const filterBy = () => true;



    return (
        <Typeahead
            positionFixed
            clearButton
            id="ASDASD"
            // positionFixed={true}
            options={[
                { id: 1, name: "cristo" },
                { id: 12, name: "cristo2" },
                { id: 21, name: "cristo2" },
                { id: 3, name: "cristo3" },
                { id: 4, name: "cristo4" },
                { id: 5, name: "cristo5" },
                { id: 6, name: "cristo6" },
                { id: 7, name: "cristo7" },
                { id: 8, name: "cristo8" },
                { id: 9, name: "cristo9" },
                { id: 10, name: "cristo 0" },
                { id: 12, name: "cristo 3" },
                { id: 2, name: "cristo2" },
                { id: 4, name: "cristo4" },
            ]}

            filterBy={filterBy}
            minLength={1}
            labelKey={"name"}

            multiple={false}
            useCache={false}
        />
    );
});

// https://reactjs.org/docs/typechecking-with-proptypes.html
TypeaheadTT.propTypes = {
    name: PropsType.string,
    placeholder: PropsType.string,
    colWidth: PropsType.oneOfType([PropsType.string, PropsType.number]),
    isMobile: PropsType.bool,
    tabIndex: PropsType.number,
    id: PropsType.string,
    columns: PropsType.array,
    isLoading: PropsType.bool,
    options: PropsType.array,
    selected: PropsType.array,
    onSearch: PropsType.func,
    onChange: PropsType.func,
    labelKey: PropsType.string,
};

export default React.memo(TypeaheadTT);
