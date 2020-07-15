import * as React from 'react';

interface RgReactInputProps {
    value?: string | number;
    error?: string | null;
    compareValue?: string;
    copyPrevent?: boolean;
    pastePrevent?: boolean;
    oldPasswordCompare?: string;
    updateCallback?: (value: any) => any;
    validateCallback?: (field: string, required: boolean) => any;
    maxSize?: number;
    required?: boolean;
    fieldForValidate?: string;
    innValidation?: boolean;
    emailValidation?: boolean;
    textarea?: boolean;
    fioValidation?: boolean;
    stringValidation?: boolean;
    phoneValidation?: boolean;
    cadastreValidation?: boolean;
    validationRegExp?: RegExp;
    validationErrorText?: string;
    validPassword?: boolean;
    validLengthPassword?: boolean;
    validComparePassword?: boolean;
    validCompareEmail?: boolean;
    compareWithOldPassword?: boolean;
    onEnter?: () => any;
    onFocus?: () => any;
    onBlur?: () => any;
    onClickCallback?: (value: any) => any;
    label?: string;
    placeholder?: string;
    componentClass?: string;
    disabled?: boolean;
    iconSvg?: any;
    iconHTML?: any;
    iconCallback?: () => any;
    type?: string;
    mask?: string;
    prefixClass?: string;
    maxNumber?: number;
    minNumber?: number;
    dictionaryCallback?: () => any;
    topLabel?: boolean;
    widthLabel?: number;
    searchMode?: boolean;
    withoutBlurValidation?: boolean;
    rows?: string | number;
    dataTemplate?: string;
}

export class RgReactInput extends React.Component<RgReactInputProps, any> {}
