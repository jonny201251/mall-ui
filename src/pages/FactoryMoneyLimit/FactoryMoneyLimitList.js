import React, {PureComponent} from 'react'
import {message, Modal} from 'antd'
import List, {Filter, Pagination, Table} from 'nolist/lib/wrapper/antd'
import {Button, Dialog, Input} from 'nowrapper/lib/antd'

import request from '../../utils/request'

let globalList
const factoryMoneyLimitPath = '/mall/factoryMoneyLimit'

class FactoryMoneyLimitList extends PureComponent {
    state = {}

    render() {
        return (
            <div>
                FactoryMoneyLimitList
            </div>
        );
    }
}

export default FactoryMoneyLimitList