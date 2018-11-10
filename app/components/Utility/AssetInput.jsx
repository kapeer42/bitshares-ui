import React, {Fragment, PureComponent} from "react";
import PropTypes from "prop-types";
import counterpart from "counterpart";
import {Form, Input, Button} from "bitshares-ui-style-guide";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import Translate from "react-translate-component";

const isAssetObj = asset => !!(asset && typeof asset.get === "function");

class AssetInputView extends PureComponent {
    render() {
        const {
            label,
            onChange,
            placeholder,
            style,
            inputStyle,
            value,
            validateStatus,
            onAction,
            actionLabel,
            disableActionButton,
            help
        } = this.props;
        const hasAction = typeof onAction === "function";
        return (
            <Fragment>
                <Form.Item
                    colon={false}
                    label={<Translate content={label} />}
                    style={style}
                    className={
                        "asset-input" + (hasAction ? " with-action" : "")
                    }
                    validateStatus={validateStatus}
                    hasFeedback
                    help={help}
                >
                    <Input
                        value={value}
                        onChange={onChange}
                        style={inputStyle}
                        placeholder={placeholder}
                    />
                </Form.Item>
                {hasAction && (
                    <Form.Item>
                        <Button
                            type="primary"
                            disabled={
                                disableActionButton === undefined
                                    ? validateStatus !== "success"
                                    : disableActionButton
                            }
                            onClick={onAction}
                        >
                            <Translate content={actionLabel} />
                        </Button>
                    </Form.Item>
                )}
            </Fragment>
        );
    }
}

class ControlledAssetInput extends PureComponent {
    static propTypes = {
        asset: ChainTypes.ChainAsset, // the selected asset
        placeholder: PropTypes.string, // the placeholder text to be displayed when there is no input
        onChange: PropTypes.func, // a method to be called when the input changes, the input is passed as argument
        onFound: PropTypes.func, // a method to be called when a valid asset is found, the asset object is passed as argument. is called with null when the input is changed to an invalid asset name
        style: PropTypes.object, // style to pass to the containing component (Form.Item)
        label: PropTypes.string, // a translation key for the label
        inputStyle: PropTypes.object, // Input component style
        value: PropTypes.string // the current value of the asset selector, the string the user enters
    };

    checkFound = prevAsset => {
        const {onFound} = this.props;
        if (typeof onFound === "function") {
            const {asset} = this.props;
            if (
                isAssetObj(prevAsset) && isAssetObj(asset)
                    ? prevAsset.get("id") !== asset.get("id")
                    : prevAsset != asset && asset !== undefined
            ) {
                onFound(isAssetObj(asset) ? asset : null);
            }
        }
    };

    componentDidMount() {
        this.checkFound();
    }

    componentDidUpdate(prevProps) {
        this.checkFound(prevProps.asset);
    }

    handleChange = event => {
        const {onChange} = this.props;
        if (typeof onChange === "function") onChange(event.target.value);
    };

    getValidateStatus = () => {
        const {validateStatus, asset, resolved} = this.props;
        return typeof validateStatus === "string"
            ? validateStatus
            : resolved
                ? isAssetObj(asset)
                    ? "success"
                    : "error"
                : "validating";
    };

    handleAction = () => {
        const {asset, onAction} = this.props;
        onAction(asset);
    };

    render() {
        const {
            label,
            placeholder,
            inputStyle,
            style,
            value,
            actionLabel,
            help,
            onAction
        } = this.props;
        return (
            <AssetInputView
                label={label}
                onChange={this.handleChange}
                onAction={
                    typeof onAction === "function"
                        ? this.handleAction
                        : undefined
                }
                actionLabel={actionLabel}
                placeholder={counterpart.translate(
                    placeholder || "account.user_issued_assets.symbol"
                )}
                inputStyle={inputStyle}
                style={style}
                value={value}
                validateStatus={this.getValidateStatus()}
                help={help || ""}
            />
        );
    }
}

const BoundAssetInput = BindToChainState(ControlledAssetInput);

// helper so you only need to pass "value" prop instead of both "asset" and "value"
class AssetInput extends PureComponent {
    render() {
        return <BoundAssetInput asset={this.props.value} {...this.props} />;
    }
}

// wrapper so you only need to hook onFound and provide a defaultValue
class UncontrolledAssetInput extends PureComponent {
    state = {
        value: undefined
    };

    static getDerivedStateFromProps = (props, state) => ({
        value:
            typeof state.value === "undefined"
                ? props.defaultValue || ""
                : state.value
    });

    handleChange = value => {
        this.setState({value: value.toUpperCase()});
    };

    render() {
        const {onChange} = this.props;
        const childProps =
            typeof onChange === "function"
                ? this.props
                : {
                      ...this.props,
                      value: this.state.value,
                      onChange: this.handleChange
                  };
        return <AssetInput {...childProps} />;
    }
}

export default UncontrolledAssetInput;
