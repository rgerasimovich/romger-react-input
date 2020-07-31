import { FlexBox } from '@romger/react-flex-layout';
import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';
import { IMaskInput } from 'react-imask';

class RgReactInput extends React.Component {
    constructor(props) {
        super(props);

        this.ERROR_NOT_VALID = 'Поле заполнено некорректно';
        this.ERROR_NOT_VALID_INN = 'ИНН введён некорректно';
        this.ERROR_NOT_VALID_PASSWORD = 'Поле заполнено некорректно';
        this.ERROR_NOT_VALID_LENGTH_PASSWORD = 'Пароль должен быть не короче восьми символов';
        this.ERROR_NOT_COMPARE_PASSWORD = 'Пароли не совпадают';
        this.ERROR_NOT_COMPARE_EMAIL = 'Email не совпадает';
        this.ERROR_EMPTY = 'Это поле обязательно для заполнения';
        this.NEW_PASSWORD_NOT_EQUAL_WITH_OLD = 'Новый пароль не должен совпадать с текущим';
        this.DEFAULT_PREFIX_CLASS = 'input-block';
        this.ENTER_KEY = 'Enter';
        this.emailReg = /^[-._a-zA-Z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$/;
        this.fioReg = /^[a-zA-Zа-яА-ЯёЁ'][a-zA-Z-а-яА-ЯёЁ' ]+[a-zA-Zа-яА-ЯёЁ']$/;
        this.stringReg = /^[-а-яА-ЯёЁa-zA-Z]+$/;
        this.cadastreReg = /^\d{2}:\d{2}:\d{1,7}:\d{1,}$/;
        this.phoneReg = /^((\+7|7|8)+([0-9]){10})$/gm;
        this.phoneMask = '+{7} (000) 000-00-00';
        this.state = {
            error: this.props.error,
        };
    }

    componentWillMount() {
        if (!this.props.value) {
            if (this.props.validateCallback) {
                this.props.validateCallback(this.props.fieldForValidate, !this.props.required);
            }
        }
    }

    componentDidMount() {
        if (this.input) {
            this.input.dataset.template = this.props.dataTemplate;
        }
    }

    componentWillReceiveProps(newProps, nextContext) {
        if (newProps.error !== this.props.error) {
            this.setState({
                error: newProps.error
            });
        }
        if (this.props.validCompareEmail && this.props.compareValue && this.props.compareValue !== newProps.compareValue) {
            this._validationCompareEmail(newProps.value, newProps);
        }
    }

    get iconMenu() {
        return <svg
            className={classnames(
                'select-icon',
            )}
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24"
            viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>;
    }

    get iconClose() {
        return <svg
            className={classnames(
                'select-icon',
            )}
            version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            width="24px" height="24px" viewBox="0 0 24 24" enableBackground="new 0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
        </svg>;
    }

    get iconSearch() {
        return <svg
            className={classnames(
                'select-icon',
            )}
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
        </svg>;
    }

    /**
     * Провалидируем инпут при блюре
     */
    validationOnBlur() {
        if (!!this.props.withoutBlurValidation) {
            return;
        }
        this.validationField({
            target: {
                value: this.props.value,
            },
        });
    }

    /**
     * Валидировать поле
     * @param {*} event
     */
    validationField(event) {
        if (this.props.maxSize && event.target.value.length > this.props.maxSize) {
            return;
        }
        if (this.props.required && !event.target.value) {
            this.setState({ error: this.ERROR_EMPTY });
            if (this.props.validateCallback) {
                this.props.validateCallback(this.props.fieldForValidate, (this.state.error === null));
            }
            return this.props.updateCallback({
                target: {
                    value: this.props.emailValidation ? event.target.value.trim() : event.target.value,
                },
            });
        } else {
            this.setState({ error: this.props.error ? this.props.error : null });
        }
        let valid = true;

        if (this.props.innValidation && event.target.value) {
            valid = this._validationINN(event.target.value);
        }
        if (this.props.emailValidation && event.target.value.trim()) {
            valid = this._validationEmail(event.target.value.trim());
        }
        if (this.props.fioValidation && event.target.value) {
            valid = this._validationFio(event.target.value.trim());
        }
        if (this.props.cadastreValidation && event.target.value) {
            valid = this._validationCadastre(event.target.value);
        }
        if (this.props.stringValidation && event.target.value) {
            valid = this._validationString(event.target.value);
        }
        if (this.props.phoneValidation && event.target.value) {
            valid = this._validationPhone(event.target.value);
        }
        if (this.props.validLengthPassword && event.target.value) {
            valid = this._validationLengthPassword(event.target.value);
        }
        if (this.props.validPassword && event.target.value) {
            valid = this._validationPassword(event.target.value);
        }
        if (this.props.validComparePassword && event.target.value) {
            valid = this._validationComparePassword(event.target.value);
        }
        if (this.props.validCompareEmail && event.target.value) {
            valid = this._validationCompareEmail(event.target.value);
        }
        if (this.props.compareWithOldPassword && event.target.value) {
            valid = this._validationCompareOldPassword(event.target.value);
        }
        if (this.props.validationRegExp) {
            valid = this.validateStringByRegExp(event.target.value, this.props.validationRegExp);
        }

        if (this.props.validateCallback) {
            this.props.validateCallback(this.props.fieldForValidate, valid);
        }
        this.setState({ change: true });
        return this.props.updateCallback({
            target: {
                value: this.props.emailValidation ? event.target.value.trim() : event.target.value,
            },
        });
    }

    _validationINN(inn) {
        let valid = this._validationINNAction(inn);
        this.setState({
            error: valid
                ? (this.props.error ? this.props.error : null)
                : this.ERROR_NOT_VALID_INN,
        });
        return valid;
    }

    /**
     * валидация инн
     */
    _validationINNAction(inn) {
        let valid = false;
        let dex = 10;
        let minValidLength = 10;
        let maxValidLength = 12;
        let checkSeparate = 11;
        if (!inn || (inn.length !== minValidLength && inn.length !== maxValidLength)) {
            return valid;
        }
        let checkInn = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
        let checkSum;
        let arrInn = inn.split('')
            .map(el => parseInt(el, dex));
        if (arrInn.length === maxValidLength) {
            checkSum = this.checkSumInn(arrInn, checkInn, 2, 1);
            valid = checkSum % checkSeparate === arrInn[arrInn.length - 2];
            if (!valid) {
                return valid;
            }
            checkSum = this.checkSumInn(arrInn, checkInn, 1, 0);
            valid = checkSum % checkSeparate === arrInn[arrInn.length - 1];
            return valid;
        }
        checkSum = this.checkSumInn(arrInn, checkInn, 1, 2);
        valid = checkSum % checkSeparate === arrInn[arrInn.length - 1];
        return valid;
    }

    checkSumInn(array, checkArray, endIndexSubtract, checkIndexStartAdd) {
        let checkSum = 0;
        for (let i = 0; i < array.length - endIndexSubtract; i++) {
            checkSum = checkSum + array[i] * checkArray[i + checkIndexStartAdd];
        }
        return checkSum;
    }

    /**
     * Валидация длины пароля
     * @param {*} value
     */
    _validationLengthPassword(value) {
        const minLengthPassword = 8;
        if (value.length < minLengthPassword) {
            this.setState({ error: this.ERROR_NOT_VALID_LENGTH_PASSWORD });
            return false;
        } else {
            this.setState({ error: (this.props.error ? this.props.error : null) });
            return true;
        }
    }

    /**
     * Валидация пароля
     * @param {*} value
     */
    _validationPassword(value) {
        const minLengthPassword = 8;
        let regExp = /([0-9]{1})([a-z]{1})([A-Z]{1})/;
        if (!regExp.test(value) && value.length < minLengthPassword) {
            this.setState({ error: this.ERROR_NOT_VALID_PASSWORD });
            return false;
        } else {
            this.setState({ error: (this.props.error ? this.props.error : null) });
            return true;
        }
    }

    /**
     * Сравнение паролей
     * @param {*} value
     */
    _validationComparePassword(value) {
        if (value !== this.props.compareValue) {
            this.setState({ error: this.ERROR_NOT_COMPARE_PASSWORD });
            return false;
        } else {
            this.setState({ error: (this.props.error ? this.props.error : null) });
            return true;
        }
    }

    /**
     * Сравнение email
     * @param {*} value
     * @param {*} props
     */
    _validationCompareEmail(value, props = this.props) {
        if (value !== props.compareValue) {
            this.setState({ error: this.ERROR_NOT_COMPARE_EMAIL });
            return false;
        } else {
            this.setState({ error: (this.props.error ? this.props.error : null) });
            return true;
        }
    }

    /**
     * Сравнение нового и старого пароля
     * @param {*} value
     */
    _validationCompareOldPassword(value) {
        if (value === this.props.oldPasswordCompare) {
            this.setState({ error: this.NEW_PASSWORD_NOT_EQUAL_WITH_OLD });
            return false;
        } else {
            this.setState({ error: (this.props.error ? this.props.error : null) });
            return true;
        }
    }

    /**
     * Валидация по email
     * @param {*} value
     */
    _validationEmail(value) {
        return this.validateStringByRegExp(value, this.emailReg);
    }

    /**
     * Валидация фио
     * @param {*} value
     */
    _validationFio(value) {
        return this.validateStringByRegExp(value, this.fioReg);
    }

    /**
     * Валидация по кадастровому номеру
     * @param {*} value
     */
    _validationCadastre(value) {
        return this.validateStringByRegExp(value, this.cadastreReg);
    }

    /**
     * Валидация по строке
     * @param {*} value
     */
    _validationString(value) {
        return this.validateStringByRegExp(value, this.stringReg);
    }

    /**
     * Валидация по телефону
     * @param {*} value
     */
    _validationPhone(value) {
        return this.validateStringByRegExp(value.replace(/[\s-\(\)_]/g, ''), this.phoneReg);
    }

    /**
     * Валидировать строку регулярным выражением
     * @param value
     * @param regExp
     * @param validationErrorText
     */
    validateStringByRegExp(value, regExp, validationErrorText = this.ERROR_NOT_VALID) {
        if (!regExp.test(value)) {
            this.setState({ error: this.getValidationErrorText(validationErrorText) });
            return false;
        } else {
            this.setState({ error: (this.props.error ? this.props.error : null) });
            return true;
        }
    }

    /**
     * Получить текст ошибки
     * @param errorText
     */
    getValidationErrorText(errorText) {
        return this.props.validationErrorText || errorText;
    }

    /**
     * Получить объект стилей для родительского элемента
     * @param {*} prefixClass
     * @param {*} iconSvg
     * @param {*} iconHTML
     * @param {*} searchMode
     */
    getStyleParent(prefixClass, iconSvg, iconHTML, searchMode) {
        let style = {};
        style[this.DEFAULT_PREFIX_CLASS + '--error'] = !!this.state.error;
        style[prefixClass + '--error'] = !!this.state.error;
        style[this.DEFAULT_PREFIX_CLASS + '--required'] = !!this.props.required;
        style[prefixClass + '--required'] = !!this.props.required;
        style[this.DEFAULT_PREFIX_CLASS + '--with-icon'] = ((!!iconSvg || !!iconHTML) && !this.props.dictionaryCallback) || ((!iconSvg && !iconHTML) && !!this.props.dictionaryCallback);
        style[prefixClass + '--with-icon'] = ((!!iconSvg || !!iconHTML) && !this.props.dictionaryCallback) || ((!iconSvg && !iconHTML) && !!this.props.dictionaryCallback);
        style[this.DEFAULT_PREFIX_CLASS + '--with--double-icon'] = (!!iconSvg || !!iconHTML) && !!this.props.dictionaryCallback;
        style[prefixClass + '--with--double-icon'] = (!!iconSvg || !!iconHTML) && !!this.props.dictionaryCallback;
        style[this.DEFAULT_PREFIX_CLASS + '--search-mode'] = !!searchMode;
        style[prefixClass + '--search-mode'] = !!searchMode;
        return style;
    }

    /**
     * Событие нажатия на клавишу, находясь в инпуте
     * @param {*} e
     */
    onKeyPressHandler(e) {
        if (e.key === this.ENTER_KEY) {
            this.props.onEnter ? this.props.onEnter() : null;
        }
    }

    /**
     * Что делать при попытке вставить что-то в поле
     * @param {*} e
     */
    pastePrevent(e) {
        if (!!this.props.pastePrevent && !this.props.phoneValidation) {
            return e.preventDefault();
        }
        if (!!this.props.phoneValidation) {
            return this.pastePhone(e);
        }
    }

    pastePhone(e) {
        try {
            let pasteValue = e.clipboardData.getData('Text');
            pasteValue = pasteValue.replace(/\D+/g,'');
            const maxLengthPhone = 10;
            pasteValue = pasteValue.substring(pasteValue.length - maxLengthPhone < 0 ? 0 : pasteValue.length - maxLengthPhone);
            let mask = this.phoneMask;
            let newValue = [];
            let indexFromPasteValue = 0;
            for (let i = 0; i< mask.length; i++) {
                if (mask[i] === '0' && indexFromPasteValue < pasteValue.length) {
                    newValue.push(pasteValue[indexFromPasteValue]);
                    indexFromPasteValue++;
                }
                else if(mask[i] !== '{' && mask[i] !== '}') {
                    newValue.push(mask[i]);
                }
            }
            e.preventDefault();
            this.validationField({target: {value: newValue.join('')}});
            return false;
        } catch(e) {
            //
        }
    }

    render() {
        const { searchMode, label, value, placeholder, required, componentClass, maxSize, disabled, iconSvg, iconHTML, iconCallback, topLabel, widthLabel } = this.props;
        let mask;
        let type = this.props.type ? this.props.type : 'text';
        let isNumberOrRangeType = type === 'number' || type === 'range';

        mask = this.props.phoneValidation
            ? this.phoneMask
            : this.props.mask
                ? this.props.mask
                : null;

        let styleLabel = null;
        if (widthLabel) {
            styleLabel = {
                width: `${widthLabel}px`,
            };
        }
        const prefixClass = this.props.prefixClass ? this.props.prefixClass : this.DEFAULT_PREFIX_CLASS;
        return (
            <div className={classnames(
                this.DEFAULT_PREFIX_CLASS,
                prefixClass,
                this.getStyleParent(prefixClass, iconSvg, iconHTML, searchMode),
            )}>
                {
                    !!label && !!topLabel &&
                    <div className={classnames(
                        this.DEFAULT_PREFIX_CLASS + '__label',
                        prefixClass + '__label',
                    )}>
                        {label}
                        {required ? <span>{' *'}</span> : ''}
                    </div>
                }
                <FlexBox
                    row="start center"
                    className={classnames(
                        this.DEFAULT_PREFIX_CLASS + '__input-wrap',
                        prefixClass + '__input-wrap',
                        {
                            [this.DEFAULT_PREFIX_CLASS + '__input-wrap--textarea']: componentClass === 'textarea' || !!this.props.textarea,
                            [prefixClass + '__input-wrap--textarea']: componentClass === 'textarea' || !!this.props.textarea,
                        },
                    )}
                >
                    {
                        !!label && !topLabel &&
                        <div
                            className={classnames(
                                this.DEFAULT_PREFIX_CLASS + '__label',
                                prefixClass + '__label',
                                this.DEFAULT_PREFIX_CLASS + '__label--left',
                                prefixClass + '__label--left',
                                {
                                    [this.DEFAULT_PREFIX_CLASS + '__label--left-textarea']: componentClass === 'textarea' || !!this.props.textarea,
                                    [prefixClass + '__label--left-textarea']: componentClass === 'textarea' || !!this.props.textarea,
                                },
                            )}
                            style={styleLabel}
                        >
                            {label}
                            {required ? <span>{' *'}</span> : ''}
                        </div>
                    }

                    <FlexBox
                        flex={true}
                        column="start stretch"
                        className={classnames(
                            this.DEFAULT_PREFIX_CLASS + '__input-position-wrap',
                            prefixClass + '__input-position-wrap',
                            {
                                [this.DEFAULT_PREFIX_CLASS + '__input-position-wrap--textarea']: componentClass === 'textarea' || !!this.props.textarea,
                                [prefixClass + '__input-position-wrap--textarea']: componentClass === 'textarea' || !!this.props.textarea,
                            },
                        )}
                    >
                        {
                            mask
                                ?
                                <IMaskInput
                                    mask={mask}
                                    value={value ? value : ''}
                                    unmask={false}
                                    inputRef={el => this.input = el}
                                    onAccept={(value, mask) => null}
                                    onInput={(e) => this.validationField(e)}
                                    placeholder={placeholder ? placeholder : ''}
                                    disabled={disabled}
                                    lazy={!!disabled}
                                    onPaste={(event) => this.pastePrevent(event)}
                                />
                                :
                                this.props.textarea || this.props.componentClass === 'textarea'
                                    ?
                                    <textarea
                                        style={{ resize: 'none' }}
                                        disabled={disabled}
                                        onBlur={() => {
                                            this.validationOnBlur();
                                            if (this.props.onBlur) {
                                                this.props.onBlur();
                                            }
                                        }}
                                        onChange={(e) => this.validationField(e)}
                                        onClick={(e) => this.props.onClickCallback ? this.props.onClickCallback(e) : null}
                                        onCopy={(event) => this.props.copyPrevent ? event.preventDefault() : null}
                                        onFocus={() => this.props.onFocus ? this.props.onFocus() : null}
                                        onKeyPress={(e) => this.onKeyPressHandler(e)}
                                        onPaste={(event) => this.pastePrevent(event)}
                                        placeholder={placeholder ? placeholder : ''}
                                        rows={this.props.rows ? this.props.rows : 2}
                                        value={value ? value : ''}
                                        data-template={this.props.dataTemplate}
                                    />
                                    :
                                    <input
                                        disabled={disabled}
                                        max={isNumberOrRangeType && this.props.maxNumber ? this.props.maxNumber : null}
                                        min={isNumberOrRangeType && this.props.minNumber ? this.props.minNumber : null}
                                        onBlur={() => {
                                            this.validationOnBlur();
                                            if (this.props.onBlur) {
                                                this.props.onBlur();
                                            }
                                        }}
                                        onChange={(e) => this.validationField(e)}
                                        onClick={(e) => this.props.onClickCallback ? this.props.onClickCallback(e) : null}
                                        onCopy={(event) => this.props.copyPrevent ? event.preventDefault() : null}
                                        onFocus={() => this.props.onFocus ? this.props.onFocus() : null}
                                        onKeyPress={(e) => this.onKeyPressHandler(e)}
                                        onPaste={(event) => this.pastePrevent(event)}
                                        placeholder={placeholder ? placeholder : ''}
                                        type={type}
                                        value={value ? value : ''}
                                        data-template={this.props.dataTemplate}
                                    />
                        }
                        <FlexBox
                            row="start end"
                            className={classnames(
                                this.DEFAULT_PREFIX_CLASS + '__fields-error',
                                prefixClass + '__fields-error',
                            )}>
                            {
                                this.state.error
                                    ?
                                    <div className={classnames(
                                        this.DEFAULT_PREFIX_CLASS + '__text-overflow',
                                        prefixClass + '__text-overflow',
                                    )}>{this.state.error}</div>
                                    : null
                            }
                            <FlexBox flex={true}/>
                            {
                                maxSize
                                    ?
                                    <div className={classnames(
                                        this.DEFAULT_PREFIX_CLASS + '__max-size',
                                        prefixClass + '__max-size',
                                    )}>{value ? value.length : '0'} / {maxSize}</div>
                                    : null
                            }
                        </FlexBox>
                    </FlexBox>
                </FlexBox>

                {
                    !!searchMode &&
                    <div
                        className={classnames(
                            this.DEFAULT_PREFIX_CLASS + '__icon',
                            prefixClass + '__icon',
                            this.DEFAULT_PREFIX_CLASS + '__icon--search',
                            prefixClass + '__icon--search',
                            {
                                [this.DEFAULT_PREFIX_CLASS + '__icon--with-label']: !!label && !!topLabel,
                            }
                        )}
                    >
                        {
                            this.iconSearch
                        }
                    </div>
                }
                {
                    !!(iconSvg || iconHTML || !!(!!searchMode && !!value))
                        ?
                        <div
                            className={classnames(
                                this.DEFAULT_PREFIX_CLASS + '__icon',
                                prefixClass + '__icon',
                                {
                                    [this.DEFAULT_PREFIX_CLASS + '__icon--double']: !!this.props.dictionaryCallback,
                                    [prefixClass + '__icon--double']: !!this.props.dictionaryCallback,
                                    [this.DEFAULT_PREFIX_CLASS + '__icon--with-label']: !!label && !!topLabel,
                                },
                            )}
                            onClick={() => !!searchMode ? this.validationField({ target: { value: '' } }) : iconCallback()}>
                            {
                                !!iconHTML
                                    ?
                                    iconHTML
                                    :
                                    <ReactSVG
                                        src={iconSvg}
                                    />
                            }
                            {
                                !!searchMode &&
                                this.iconClose
                            }
                        </div>
                        : null
                }
                {
                    !!this.props.dictionaryCallback &&
                    <div
                        className={classnames(
                            this.DEFAULT_PREFIX_CLASS + '__icon',
                            prefixClass + '__icon',
                            {
                                [this.DEFAULT_PREFIX_CLASS + '__icon--with-label']: !!label && !!topLabel,
                            },
                        )}
                        onClick={() => this.props.dictionaryCallback()}>
                        {
                            this.iconMenu
                        }
                    </div>
                }
            </div>
        );
    }
}

export default RgReactInput;
