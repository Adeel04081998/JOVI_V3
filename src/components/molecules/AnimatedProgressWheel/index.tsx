import React, { Fragment, PureComponent } from 'react';
import { View, Animated, StyleSheet, Dimensions, Easing } from 'react-native';
import PropTypes from 'prop-types';
import Text from '../../atoms/Text';
import { SvgXml } from 'react-native-svg';
import ENUMS from '../../../utils/ENUMS';
const { abs, acos, cos, PI, sin } = Math
const { width } = Dimensions.get('screen');
const elementCountWithMax = 4;
class AnimatedProgressWheel extends PureComponent {
    state = {
        animatedVal: new Animated.Value(0),
        rotationIndex: 1,
        scrolling: false,
        theta: (2 * PI) / elementCountWithMax,
    };
    rotationOffset: any = 0;
    radius: any = (this.props.size - 24) / 2;
    center: any = this.radius;
    pitstopSize: any = 50;
    animatedPitstops: any = [
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ];
    componentDidMount() {
        const { animateFromValue, progress } = this.props;
        const { animatedVal } = this.state;

        if (animateFromValue >= 0) {
            animatedVal.setValue(animateFromValue);
            this.animateTo(progress);
        } else {
            animatedVal.setValue(progress);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.progress !== this.props.progress) {
            this.animateTo(this.props.progress);
            // this.state.animatedVal.setValue(this.props.progress);
        }
    }

    interpolateAnimVal = (inputRange, outputRange) =>
        this.state.animatedVal.interpolate({
            inputRange,
            outputRange,
            extrapolate: 'clamp',
        });

    interpolateRotation = isSecondHalf =>
        this.interpolateAnimVal(isSecondHalf ? [50, 100] : [0, 50], [
            '0deg',
            '180deg',
        ]);

    interpolateRotationTwoOpacity = () =>
        this.interpolateAnimVal([50, 50.01], [0, 1]);

    interpolateColorOpacity = () => this.interpolateAnimVal([0, 100], [0, 1]);

    animateTo = (
        toValue,
        duration = this.props.duration,
        easing = Easing.easeInOut,
    ) => {
        Animated.timing(this.state.animatedVal, {
            toValue,
            duration,
            easing,
            useNativeDriver: true,
        }).start(async status => {
            this.props.onAnimationComplete(status);
        });
    };

    resetAnimation = (progress = this.props.progress) =>
        this.state.animatedVal.setValue(progress);

    circleHalf = (styles, isSecondHalf, color) => (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: isSecondHalf ? this.interpolateRotationTwoOpacity() : 1,
                    transform: [{ rotate: this.interpolateRotation(isSecondHalf) }],
                },
            ]}>
            <View
                style={[
                    styles.halfCircle,
                    isSecondHalf && {
                        bottom: 0,
                        transform: [{ rotate: '180deg' }],
                    },
                ]}>
                <View style={[styles.circleArc, { borderColor: color }]} />
            </View>
        </Animated.View>
    );

    renderLoader = (styles, color = this.props.color) => (
        <Fragment>
            <View style={{ ...styles.background, backgroundColor: 'white' }} />
            {this.circleHalf(styles, false, color)}
            <View style={{ ...styles.halfCircle }}>
                <View style={styles.cutOff} />
            </View>
            <View style={styles.secondHalfContainer}>
                {this.circleHalf(styles, true, color)}
            </View>
        </Fragment>
    );
    degrees_to_radians(degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180);
    }
    _getTransforms = (index: any) => {
        const radius = 90;
        const flatness = 0.62;
        // const initialRotationOffset = 90;
        const initialRotationOffset = this.props.initialRotationOffset;

        const { theta } = this.state
        // const radius =90;
        const thetaOffset = 2 * PI * index + (this.rotationOffset + initialRotationOffset) * 0.4
        const translateX = radius * cos(index * theta + thetaOffset)
        const translateY =
            (1 - flatness) * radius * sin(index * theta + thetaOffset) + (1 - flatness) * radius

        // console.log('flatness', { translateX, translateY }, radius);
        return { translateX, translateY: translateY }
    }

    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    RenderPitstopCircle = ({ item, index, x, y }) => {
        const icon = this.randomIntFromInterval(0, 3);
        React.useEffect(() => {
            setTimeout(() => {
                Animated.timing(this.animatedPitstops[index], {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                    easing: Easing.ease
                }).start();
            }, index === 0 ? 50 : ((index / 10) * 1000) + (200 * index))
        }, []);
        return <Animated.View style={{
            position: 'absolute',
            width: this.pitstopSize, height: this.pitstopSize, backgroundColor: 'white', top: x, left: y, borderRadius: this.pitstopSize / 2, shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,

            elevation: 6,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: this.animatedPitstops[index],
            transform: [{
                scale: this.animatedPitstops[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1]
                })
            }, { scaleX: -1 }, {
                rotate: '180deg',
            }]
        }}>
            <SvgXml xml={ENUMS.PITSTOP_TYPES[icon].icon} height={"80%"} width={"80%"} />
        </Animated.View>
    };
    renderOverlay = (styles, color = this.props.color) => {
        let angle = 0;
        const increment = 360 / this.props.pitstops.length;
        let views = this.props.pitstops.map((item, i) => {
            const angleRad = this.degrees_to_radians(angle);
            const xIncrement = i === 0 ? 20 : 20;
            const yIncrement = i === 0 ? 20 : 20;
            let x = (this.radius * Math.cos(angleRad) + this.center - this.pitstopSize / 2) + xIncrement;
            let y = (this.radius * Math.sin(angleRad) + this.center - this.pitstopSize / 2) + yIncrement;
            y = i < 2 ? y : y;
            angle = angle + increment;
            const RenderPitstop = this.RenderPitstopCircle;
            return <RenderPitstop index={i} item={item} x={x} y={y} />
        })
        return views;
    };
    renderPitstopsCircle = (styles) => {
        if(this.props.pitstops && this.props.pitstops.length<1) return;
        return <View style={{
            position: 'absolute', display: 'flex', transform: [{ scaleX: -1 }, {
                rotate: '180deg'
            }], alignItems: 'center', ...this.props.pitstops.length % 2 === 0 ? {} : {}, borderRadius: this.props.size / 2, top: 45, height: this.props.size - 20, width: this.props.size + 20,
        }}>
            {this.renderOverlay(styles)}
        </View>
    }
    render() {
        const styles = generateStyles(this.props);
        const { fullColor } = this.props;

        return (
            <>
                <View style={styles.container}>
                    {this.renderLoader(styles)}
                    {fullColor && (
                        <Animated.View
                            style={{
                                position: 'absolute',
                                opacity: this.interpolateColorOpacity(),
                            }}>
                            {this.renderLoader(styles, fullColor)}
                        </Animated.View>
                    )}
                </View>
                {this.renderPitstopsCircle(styles)}
            </>
        );
    }
}

AnimatedProgressWheel.defaultProps = {
    color: 'white',
    backgroundColor: 'gray',
    size: 200,
    width: 25,
    progress: 0,
    duration: 600,
    animateFromValue: -1,
    fullColor: null,
    onAnimationComplete: () => { },
    data: [],
    elementCount: 12,
    flatness: 0,
    initialRotationOffset: (3 * PI) / 2,
    radius: ((1.2 * width) / 2) - 80,
    selectedItemScale: 1.15,
    swipeSpeedMultiplier: 60,
    visibilityPadding: 3,
    pitstops:[],
};

AnimatedProgressWheel.propTypes = {
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    size: PropTypes.number,
    width: PropTypes.number,
    progress: PropTypes.number,
    duration: PropTypes.number,
    animateFromValue: PropTypes.number,
    fullColor: PropTypes.string,
    onAnimationComplete: PropTypes.func,
    radius: PropTypes.number,
    selectedItemScale: PropTypes.number,
    swipeSpeedMultiplier: PropTypes.number,
    visibilityPadding: PropTypes.number,
    lementCount: PropTypes.number,
    flatness: PropTypes.number,
    initialRotationOffset: PropTypes.number,
    pitstops: PropTypes.array,
};

const generateStyles = ({
    size,
    width,
    color,
    backgroundColor,
    containerColor,
}) =>
    StyleSheet.create({
        container: {
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: 'hidden',
            transform: [{
                rotate: '-90deg'
            }]
        },
        background: {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: width,
            borderColor: backgroundColor,
            position: 'absolute',
        },
        cutOff: {
            backgroundColor: containerColor,
            width: size,
            height: size,
            borderWidth: width,
            borderColor: backgroundColor,
            borderRadius: size / 2,
        },
        secondHalfContainer: {
            position: 'absolute',
        },
        halfCircle: {
            width: size,
            height: size / 2,
            overflow: 'hidden',
            position: 'absolute',
        },
        circleArc: {
            width: size,
            height: size,
            borderColor: color,
            borderRadius: size / 2,
            borderWidth: width,
        },
    });

export default AnimatedProgressWheel;