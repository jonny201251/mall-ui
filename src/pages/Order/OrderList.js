import React, {PureComponent} from 'react'
import {message, Modal} from 'antd'
import List, {Filter, Pagination, Table} from 'nolist/lib/wrapper/antd'
import {Button, Dialog, Input} from 'nowrapper/lib/antd'

import request from '../../utils/request'

let globalList
const orderPath = '/mall/order'

class OrderList extends PureComponent {
    state = {}

    onMount = (list) => {
        this.list = globalList = list;
    }

    renderOperation = (text, record, idx) => {
        return (<div>
            <a href={hostName + "/itemEdit?spuId=" + record.id}>编辑</a>
            <a style={{paddingLeft: 10}} href={hostPath + "/item.html?id=" + record.id} target={'blank'}>查看</a>
        </div>)
    }

    render() {
        return (
            <List url={orderPath + '/list'} onMount={this.onMount}>
                <Filter cols={5}>
                    <Filter.Item label="username" name="username"><Input/></Filter.Item>
                    <Filter.Item label="age" name="age"><Input/></Filter.Item>
                </Filter>
                <Table>
                    <Table.Column title="标题" dataIndex="orderId"/>
                    {/*<Table.Column title="操作" render={this.renderOperation}/>*/}
                </Table>
                <Pagination/>
            </List>
        )
    }
}

export default OrderList