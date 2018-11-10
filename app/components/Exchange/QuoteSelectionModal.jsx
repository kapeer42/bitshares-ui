import React from "react";
import Icon from "../Icon/Icon";
import AssetInput from "../Utility/AssetInput";
import SettingsActions from "actions/SettingsActions";
import Translate from "react-translate-component";
import counterpart from "counterpart";

import {Modal, Button, Form} from "bitshares-ui-style-guide";

export default class QuoteSelectionModal extends React.Component {
    constructor() {
        super();

        this.state = {
            backingAsset: "",
            error: false,
            valid: false
        };
    }

    _onMoveUp(quote) {
        const idx = this.props.quotes.findIndex(q => q === quote);
        SettingsActions.modifyPreferedBases({
            oldIndex: idx,
            newIndex: idx - 1
        });
    }

    _onMoveDown(quote) {
        const idx = this.props.quotes.findIndex(q => q === quote);
        SettingsActions.modifyPreferedBases({
            oldIndex: idx,
            newIndex: idx + 1
        });
    }

    _onRemove(quote) {
        const idx = this.props.quotes.findIndex(q => q === quote);
        if (idx >= 0) {
            SettingsActions.modifyPreferedBases({
                remove: idx
            });
        }
    }

    _onAdd(quote) {
        const idx = this.props.quotes.findIndex(q => q === quote.get("symbol"));
        if (idx === -1) {
            SettingsActions.modifyPreferedBases({
                add: quote.get("symbol")
            });
            this.setState({backingAsset: ""});
        }
    }

    _onInputBackingAsset(asset) {
        this.setState({
            backingAsset: asset.toUpperCase(),
            error: null
        });
    }

    _onFoundBackingAsset(asset) {
        console.log("ofba", asset);
        if (asset) {
            if (!this.props.quotes.includes(asset.get("symbol"))) {
                console.log("isValid");
                this.setState({isValid: true});
            } else {
                this.setState({
                    error: "Asset already being used",
                    isValid: false
                });
            }
        }
    }

    render() {
        const {error, isValid} = this.state;
        const quoteCount = this.props.quotes.size;
        return (
            <Modal
                title={counterpart.translate("exchange.quote_selection")}
                closable={false}
                visible={this.props.visible}
                id="quote_selection"
                overlay={true}
                onCancel={this.props.hideModal}
                footer={[
                    <Button onClick={this.props.hideModal}>
                        {counterpart.translate("modal.close")}
                    </Button>
                ]}
            >
                <section className="no-border-bottom">
                    <table className="table">
                        <thead>
                            <tr>
                                <th />
                                <th>
                                    <Translate content="account.quote" />
                                </th>
                                <th style={{textAlign: "center"}}>
                                    <Translate content="exchange.move_down" />
                                </th>
                                <th style={{textAlign: "center"}}>
                                    <Translate content="exchange.move_up" />
                                </th>
                                <th style={{textAlign: "center"}}>
                                    <Translate content="exchange.remove" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.quotes.map((q, idx) => {
                                return (
                                    <tr key={q}>
                                        <td>{idx + 1}</td>
                                        <td>{q}</td>
                                        <td className="text-center">
                                            {idx !== quoteCount - 1 && (
                                                <Icon
                                                    onClick={this._onMoveDown.bind(
                                                        this,
                                                        q
                                                    )}
                                                    name="chevron-down"
                                                    className="clickable"
                                                />
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {idx !== 0 && (
                                                <Icon
                                                    onClick={this._onMoveUp.bind(
                                                        this,
                                                        q
                                                    )}
                                                    name="chevron-down"
                                                    className="clickable rotate180"
                                                />
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {quoteCount > 1 && (
                                                <Icon
                                                    onClick={this._onRemove.bind(
                                                        this,
                                                        q
                                                    )}
                                                    name="cross-circle"
                                                    className="clickable"
                                                />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <br />
                    <AssetInput
                        label="exchange.custom_quote"
                        style={{width: "100%", paddingRight: "10px"}}
                        onFound={this._onFoundBackingAsset.bind(this)}
                        onChange={this._onInputBackingAsset.bind(this)}
                        value={this.state.backingAsset}
                        onAction={this._onAdd.bind(this)}
                        actionLabel="exchange.add_quote"
                        validateStatus={!isValid ? "error" : undefined}
                        help={!isValid ? error : undefined}
                    />
                </section>
            </Modal>
        );
    }
}
