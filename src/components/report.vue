<template>
  <div class="daily">
      <div class="daily-menu">
        <div class="daily-menu-item" :class="{on:type === 'recommend'}" @click="handleToRecommend">每日推荐</div>
        <div class="daily-menu-item" :class="{on:type === 'daily'}" @click="showThemes= !showThemes">主题日报</div>
        <ul v-show="showThemes">
          <li v-for="item in themes">
            <a :class="{on:item.id === themeId && type === 'daily'}" @click="handleToTheme(item.id)">{{item.name}}</a>
          </li>
        </ul>
      </div>
    <div class="daily-list" ref="list">
      <template v-if="type === 'recommend'">
        <div v-for="list in recommendList">
          <div class="daily-date">{{ formatDay(list.date)}}</div>
          <Item v-for="item in list.stories" :data="item" :key="item.id" @click.native="handleClickListItem(item.id)"></Item>
        </div>
      </template>
      <template v-if="type === 'daily'">
        <Item v-for="item in list" :data="item" :key="item.id"  @click.native="handleClickListItem(item.id)"></Item>
      </template>
    </div>
    <daily-article :id="articleId"></daily-article>
  </div>
</template>

<script>
import $ from '../lib/util';
import Item from './item.vue';
import dailyArticle from './daily-article.vue'
export default {
  name: 'report',
  components:{
    Item,
    dailyArticle
  },
  data () {
    return {
      themes: [],
      showThemes:false,
      type:'recommend',
      recommendList:[],
      list:{},
      dailyTime:$.getTodayTime(),
      isLoading:false,
      themeId:0,
      articleId:0,
    }
  },
  methods:{
    getThemes(){
      //axios发起请求
      $.ajax.get('themes').then(res=>{
        this.themes =res.others;
      })
    },
    handleToTheme(id){
      //改变菜单分类
      this.type= 'daily';
      //设置当前点击子类的主题日报id
      this.themeId =id;
      //清除中间栏的数据
      this.list=[];
      $.ajax.get('theme/'+id).then(res=>{
        //过滤掉类型为1的文章，改类型下的文章为空
        this.list=res.stories.filter(item=>item.type !==1);
      })
    },
    handleToRecommend(){
      this.type= 'recommend';
      this.recommendList =[];
      this.dailyTime =$.getTodayTime();
      this.getRecommendList();
    },
    getRecommendList(){
      this.isLoading =true;
      const prevDay =$.prevDay(this.dailyTime +86400000);
      $.ajax.get('news/before/'+prevDay).then(res=>{
        this.recommendList.push(res);
        this.isLoading =false;
      })
    },
    formatDay(date){
      let month =date.substr(4,2);
      let day = date.substr(6,2);
      if(month.substr(0,1) === '0') month =month.substr(1,1);
      if(day.substr(0,1)=== '0') day=day.substr(1,1);
      return ` ${month}月${day}日`;
    },
    handleClickListItem(id){
      this.articleId=id;
    }
  },
  mounted(){
    this.getThemes();

    this.getRecommendList();
    //获取到dom
    const $list= this.$refs.list;
    console.log($list)
    //监听中栏的滚动事件
    $list.addEventListener('scroll',()=>{
      //在主题日报或正在加载推荐列表时停止操作
      if(this.type=== 'daily' || this.isLoading) return;
      //已经滚动的距离加页面的高度等于整个内容区域的高度时，视为接触底部
      if(
        $list.scrollTop + document.body.clientHeight >= $list.scrollHeight
      ){
        //时间相对减少一天
        this.dailyTime -= 86400000;
        this.getRecommendList();
      }
    })

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  html,body{
    margin:0;
    padding:0;
    height:100%;
    color:#657180;
    font-size:16px;
  }
  .daily-menu{
    width:150px;
    position:fixed;
    top: 0;
    bottom:0;
    left:0;
    overflow: auto;
    background: #f5f7f9;
  }
  .daily-menu ul{
    list-style: none;
  }
  .daily-menu ul li a {
    display: block;
    color:inherit;
    text-decoration: none;
    padding:5px 0;
    margin:5px 0;
    cursor: pointer;
  }
  .daily-menu ul li a:hover,.daily-menu ul li a.on{
    color:#3399ff;
  }
  .daily-menu-item{
    font-size:18px;
    text-align: center;
    margin:5px 0;
    padding:10px 0;
    cursor: pointer;
    border-right:2px solid transparent;
    transition:all .3s ease-in-out;
  }
  .daily-menu-item:hover{
    background: #e3e8ee;
  }
  .daily-menu-item.on{
    border-right:2px solid #3399ff;
  }
  .daily-list{
    width:300px;
    position:fixed;
    top:0;
    bottom:0;
    left:150px;
    overflow: auto;
    border-right:1px solid #d7dde4;
  }
  .daily-date{
    text-align: center;
    margin:10px 0;
  }
  .daily-item{
    display: block;
    color:inherit;
    text-decoration: none;
    padding:16px;
    overflow: hidden;
    cursor: pointer;
    transition:all .3s ease-in-out;
  }
  .daily-item:hover{
    background: #e3e8ee;
  }
  .daily-article{
    margin-left:450px;
    padding:20px;
  }
  .daily-comments{
    margin:10px 0;
  }
  .daily-comments span{
    display:block;
    margin:10px 0;
    font-size:20px;
  }
  .daily-comment{
    overflow:hidden;
    margin-bottom:20px;
    padding-bottom:20px;
    border-bottom:1px dashed #e3e8ee;

  }
  .daily-comment-avatar {
    width:50px;
    height:50px;
    float:left;
  }
  .daily-comment-avatar img{
    width:100%;
    height:100%;
    border-radius:3px;
  }
  .daily-comment-content{
    margin-left:65px;
  }
  .daily-comment-name{}
  .daily-comment-time{
    color:#9ea7b4;
    font-size:14px;
    margin-top:5px;
  }
  .daily-comment-text{
    margin-top:10px;
  }
</style>
