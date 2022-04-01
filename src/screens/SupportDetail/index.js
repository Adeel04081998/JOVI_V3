import * as React from 'react';
import { Appearance, SafeAreaView } from 'react-native';
import View from '../../components/atoms/View';
import CustomHeader from '../../components/molecules/CustomHeader';
import { sharedExceptionHandler } from '../../helpers/SharedActions';
import { postRequest } from '../../manager/ApiManager';
import Endpoints from '../../manager/Endpoints';
import constants from '../../res/constants';
import theme from '../../res/theme';
import GV, { PITSTOP_TYPES, PITSTOP_TYPES_INVERTED } from '../../utils/GV';
import { stylesFunc } from './styles';

const WINDOW_WIDTH = constants.window_dimensions.width;

export default ({ navigation, route }) => {

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = theme.getTheme(GV.THEME_VALUES[PITSTOP_TYPES_INVERTED[PITSTOP_TYPES.JOVI]], Appearance.getColorScheme() === "dark");
    const styles = { ...stylesFunc(colors), };
    // #endregion :: STYLES & THEME END's FROM HERE     

    // #region :: STATE & REF's START's FROM HERE 
    const [query, updateQuery] = React.useState({ isLoading: false, error: false, errorText: '', });
    // #endregion :: STATE & REF's END's FROM HERE 

    // #region :: RENDER HEADER START's FROM HERE 
    const _renderHeader = () => {
        return (
            <SafeAreaView>
                <CustomHeader
                    title={`Complaint # `}
                    rightIconName={null}
                />

            </SafeAreaView>
        )
    }

    // #endregion :: RENDER HEADER END's FROM HERE 

    React.useEffect(() => {
        // loadData();
        return () => { };
    }, [])


    const loadData = () => {

        updateQuery({
            isLoading: true,
            error: false,
            errorText: '',
        });
        const params = {
            "pageNumber": 1,
            "itemsPerPage": 200,//GETTING MAX AMOUNT OF COMPLAINT's -- Suggested by AWAIS ;-) 
            "isAscending": true,
            "isSolved": false,
            "month": 0,
            "year": 0,
            "genericSearch": "",
            "category": 0,
            "exportExcel": false,
        };
        postRequest(Endpoints.GET_COMPLAINT, params, (res) => {
            const statusCode = res?.data?.statusCode ?? 404;
            if (statusCode === 200) {
                const resData = res?.data?.complaints?.data ?? [];
                updateQuery({
                    isLoading: false,
                    error: false,
                    errorText: '',
                });
            } else {
                updateQuery({
                    isLoading: false,
                    error: true,
                    errorText: sharedExceptionHandler(res, true),
                });
            }
        }, (err) => {
            sharedExceptionHandler(err, true);
            updateQuery({
                isLoading: false,
                error: true,
                errorText: sharedExceptionHandler(err),
            });
        })
    }

    // #region :: UI START's FROM HERE 
    return (
        <View style={{ ...styles.primaryContainer, }}>
            {_renderHeader()}


        </View>
    )

    // #endregion :: UI END's FROM HERE 

};//end of EXPORT DEFAULT

