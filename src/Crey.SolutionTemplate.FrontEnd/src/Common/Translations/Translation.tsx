import { IGlobalState } from "Common/Models";
import * as React from "react";
import {
    connect,
    InferableComponentEnhancerWithProps,
    MapDispatchToPropsFunction,
    MapDispatchToPropsNonObject,
    MapStateToProps,
} from "react-redux";
import { Dispatch } from "redux";

import * as Actions from "./Actions";
import { GetFromPart } from "./Global";
import { ITranslation, Part, PartType } from "./ITranslation";

export type TranslationProps<P extends Part, T extends ITranslation<P>, Props extends PartType<P, T>> =
    Props & ITranslationDispatchProps<P> & { Part: P };

interface ITranslationDispatchProps<P extends Part> {
    LoadTranslation(name: P): void;
}

const mapDispatchToPropsFactory =
    <TDispatchProps, TOwnProps, P extends Part>(mapDispatchToProps: MapDispatchToPropsFunction<TDispatchProps, TOwnProps>):
        MapDispatchToPropsNonObject<TDispatchProps & ITranslationDispatchProps<P>, TOwnProps> =>
        (dispatch: Dispatch, ownProps: TOwnProps) => (
            {
                ...{
                    LoadTranslation: (name: P) => {
                        dispatch(Actions.GetTranslation.Build(name));
                    },
                },
                ...mapDispatchToProps(dispatch, ownProps),
            });

export abstract class Translation<P extends Part, T extends ITranslation<P>, Props extends PartType<P, T>> extends
    React.Component<TranslationProps<P, T, Props>> {

    public componentDidMount() {
        if (this.props[this.props.Part]) {
            // Already loaded
        }
        else {
            this.props.LoadTranslation(this.props.Part);
        }
    }
}

export const connectWithTranslation =
    <P extends Part, T extends ITranslation<P>, TStateProps, TOwnProps, TDispatchProps>(
        part: P,
        mapStateToProps: MapStateToProps<TStateProps, TOwnProps, IGlobalState>,
        mapDispatchToPropsSub: MapDispatchToPropsFunction<TDispatchProps, TOwnProps>) => {
        const enhancer: InferableComponentEnhancerWithProps<
            TStateProps & { Part: P } & PartType<P, T> & TDispatchProps & ITranslationDispatchProps<P>,
            TOwnProps> =
            connect<TStateProps & { Part: P } & PartType<P, T>, TDispatchProps & ITranslationDispatchProps<P>, TOwnProps, IGlobalState>(
                (state: IGlobalState, ownProps: TOwnProps) => (
                    {
                        ...{
                            [part]: GetFromPart<P, T>(state.Translations.Current, part),
                            Part: part,
                        },
                        ...mapStateToProps(state, ownProps),
                    }),
                mapDispatchToPropsFactory<TDispatchProps, TOwnProps, P>(mapDispatchToPropsSub));
        return enhancer;
    };
