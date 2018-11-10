import React, {Fragment, PureComponent} from "react";
import Translate from "react-translate-component";
import PropTypes from "prop-types";
import {Form, Input, Select, Button} from "bitshares-ui-style-guide";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import Icon from "../Icon/Icon";

const isAssetObj = asset => !!(asset && typeof asset.get === "function");

class AssetSelect extends PureComponent {
    static propTypes = {
        // common
        assets: ChainTypes.ChainAssetsList, // an array of assets. If not provided, the component will display in text input mode
        placeholder: PropTypes.string, // the placeholder text to be displayed when there is preselected value
        style: PropTypes.object, // style to pass to the containing component
        label: PropTypes.string, // a translation key for the left label
        formItemStyle: PropTypes.object, // form item component style (used only if a label is passed)
        selectStyle: PropTypes.object // select component style (select mode only)
    };

    render() {
        const {
            label,
            assets,
            selectStyle,
            formItemStyle,
            style,
            ...props
        } = this.props;
        const select = (
            <Select showSearch style={selectStyle} {...props}>
                {assets.filter(isAssetObj).map(asset => {
                    return (
                        <Select.Option key={asset.get("symbol")}>
                            {asset.get("symbol")}
                        </Select.Option>
                    );
                })}
            </Select>
        );

        return (
            <div className={"asset-select"} style={style}>
                {label ? (
                    <Form.Item
                        colon={false}
                        label={<Translate content={label} />}
                        style={formItemStyle}
                    >
                        {select}
                    </Form.Item>
                ) : (
                    select
                )}
            </div>
        );
    }
}

AssetSelect = BindToChainState(AssetSelect);

export default AssetSelect;
