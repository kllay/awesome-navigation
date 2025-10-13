


// 移动端菜单
$('#mobile-menu-toggle').on('click', function () {
  $('#mobile-menu').fadeIn();
});

$('#mobile-menu-close').on('click', function () {
  $('#mobile-menu').fadeOut();
});


// 编辑
$(document).on('click', '.edit-nav-btn', function () {
  const title = $(this).data('title');
  const myNav = JSON.parse(localStorage.getItem('myNav')) || [];

  let found;
  myNav.forEach(group => {
    group.children.forEach(sub => {
      sub.items.forEach(item => {
        if (item.title === title) found = item;
      });
    });
  });

  if (!found) return alert('未找到该项');

  $('#custom-title').val(found.title);
  $('#custom-url').val(found.url);
  $('#custom-desc').val(found.desc);
  $('#custom-icon').val(found.icon);
  $('#custom-nav-modal').fadeIn();

  $('#save-custom-nav').off('click').on('click', function () {
    found.title = $('#custom-title').val().trim();
    found.url = $('#custom-url').val().trim();
    found.desc = $('#custom-desc').val().trim();
    found.icon = $('#custom-icon').val().trim();
    localStorage.setItem('myNav', JSON.stringify(myNav));
    alert('修改成功');
    $('#custom-nav-modal').fadeOut();
  });
});


$('#import-my-nav').on('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const imported = JSON.parse(event.target.result);
      if (!Array.isArray(imported)) throw new Error('格式错误');

      localStorage.setItem('myNav', JSON.stringify(imported));
      alert('导入成功，请刷新页面查看效果');
    } catch (err) {
      alert('导入失败：' + err.message);
    }
  };
  reader.readAsText(file);
});


$('#export-my-nav').on('click', function () {
  const data = localStorage.getItem('myNav');
  if (!data) return alert('没有可导出的数据');

  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'my-navigation.json';
  a.click();
});



// 打开弹窗
$('#create-custom').on('click', function () {
  $('#custom-nav-modal').fadeIn();
});

// 关闭弹窗
$('#close-custom-modal, #close-custom-modal-2').on('click', function () {
  $('#custom-nav-modal').fadeOut();
});

// 保存数据到 localStorage
$('#save-custom-nav').on('click', function () {
  const category = $('#custom-category').val().trim();
  const category2 = $('#custom-subcategory').val().trim();
  const title = $('#custom-title').val().trim();
  const url = $('#custom-url').val().trim();
  const desc = $('#custom-desc').val().trim();
  const icon = $('#custom-icon').val().trim();


  if (!category || !category2 || !title || !url) {
    alert('请填写完整信息');
    return;
  }

  const newItem = {
    title, url, desc, icon,
    isLocal: true
  };


  let myNav = JSON.parse(localStorage.getItem('myNav')) || [];

  // 查找是否已有该一级类目
  let group = myNav.find(g => g.category === category);
  if (!group) {
    group = {
      category,
      icon: 'fa-user',
      layout: 'vertical',
      children: []
    };
    myNav.push(group);
  }

  // 查找是否已有该二级类目
  let sub = group.children.find(s => s.category2 === category2);
  if (!sub) {
    sub = {
      category2,
      items: []
    };
    group.children.push(sub);
  }

  sub.items.push(newItem);
  localStorage.setItem('myNav', JSON.stringify(myNav));
  alert('保存成功！');
  $('#custom-nav-modal').fadeOut();
});






$(function () {
  $('[class="desc-limit"]').tooltip({
    placement: 'top',
    trigger: 'hover'
  });
  //  页面加载时渲染用户导航
  const myNav = JSON.parse(localStorage.getItem('myNav'));
  if (myNav && myNav.length > 0) {
    siteData.push(...myNav);
  }


});



$('#multi-search-btn').on('click', function () {
  const keyword = $('#multi-search-box').val().trim();
  if (!keyword) return alert('请输入关键词');

  const engines = [];
  if ($('#engine-google').is(':checked')) engines.push('google');
  if ($('#engine-baidu').is(':checked')) engines.push('baidu');
  if ($('#engine-bing').is(':checked')) engines.push('bing');

  if (engines.length === 0) return alert('请至少选择一个搜索引擎');

  $('#multi-search-result').removeClass('d-none');
  $('#search-tab-nav').html('');
  $('#search-tab-content').html('');

  engines.forEach((engine, i) => {
    const tabId = `search-${engine}`;
    const searchUrl = getSearchUrl(engine, keyword);

    $('#search-tab-nav').append(`
      <li class="nav-item">
        <a class="nav-link ${i === 0 ? 'active' : ''}" data-toggle="tab" href="#${tabId}">${engine.toUpperCase()}</a>
      </li>
    `);

    let content = '';
    if (engine === 'bing') {
      content = `<iframe src="${searchUrl}" width="100%" height="600" frameborder="0"></iframe>`;
    } else {
      content = `
        <p>${engine.toUpperCase()} 不允许嵌入搜索结果，请点击下方按钮在新标签页查看：</p>
        <a href="${searchUrl}" target="_blank" class="btn btn-info">查看 ${engine.toUpperCase()} 搜索结果</a>
      `;
    }

    $('#search-tab-content').append(`
      <div class="tab-pane fade ${i === 0 ? 'show active' : ''}" id="${tabId}">
        ${content}
      </div>
    `);
  });
});

function getSearchUrl(engine, keyword) {
  const encoded = encodeURIComponent(keyword);
  switch (engine) {
    case 'google': return `https://www.google.com/search?q=${encoded}`;
    case 'baidu': return `https://www.baidu.com/s?wd=${encoded}`;
    case 'bing': return `https://www.bing.com/search?q=${encoded}`;
    default: return '#';
  }
}



// 显示/隐藏返回顶部按钮
$(window).on('scroll', function () {
  if ($(this).scrollTop() > 200) {
    $('#back-to-top').fadeIn();
  } else {
    $('#back-to-top').fadeOut();
  }
});

// 点击返回顶部
$('#back-to-top').on('click', function () {
  $('html, body').animate({ scrollTop: 0 }, 500);
});



function getSearchUrl(engine, keyword) {
  const encoded = encodeURIComponent(keyword);
  switch (engine) {
    case 'google': return `https://www.google.com/search?q=${encoded}`;
    case 'baidu': return `https://www.baidu.com/s?wd=${encoded}`;
    case 'bing': return `https://www.bing.com/search?q=${encoded}`;
    default: return '#';
  }
}



// $(function () {
//   $.getJSON('data/sites.json', function (data) {
//     let navHtml = '';
//     let contentHtml = '';


//     if (data.children && Array.isArray(data.children)) {
//     data.forEach(category => {
//       navHtml += `<li><strong>${category.category}</strong><ul>`;
//       category.items.forEach(item => {
//         navHtml += `<li><a href="#${item.id}" target="_blank" >${item.title}</a></li>`;
//         contentHtml += `
//           <section id="${item.id}" class="mb-5">
//             <h5>${item.title}</h5>
//             <p>${item.desc}</p>
//             <a href="jump.html?target=${encodeURIComponent(item.url)}" target="_blank" class="btn btn-sm btn-primary">跳转</a>
//           </section>
//         `;
//       });
//       navHtml += `</ul></li>`;
//     });
//   }

//     $('#nav-menu').html(navHtml);
//     $('#content-area').html(contentHtml);
//   });
// });


$('#nav-menu a').on('click', function (e) {
  e.preventDefault();
  const target = $(this).attr('href');
  $('html, body').animate({
    scrollTop: $(target).offset().top - 60
  }, 600);
});


$('#search-box').on('keypress', function (e) {
  if (e.which === 13) {
  const keyword = $(this).val().trim().toLowerCase();
  if (!keyword) return;

  let found = false;

  siteData.forEach((group, groupIndex) => {
    group.children.forEach((sub, subIndex) => {
      sub.items.forEach(item => {
        const title = item.title.toLowerCase();
        const desc = item.desc.toLowerCase();

        if (title.includes(keyword) || desc.includes(keyword)) {
          found = true;

          // 自动展开左侧分类
          $('.toggle-group').eq(groupIndex).click();

          // 激活左侧二级菜单
          $('.nav-link-sub').removeClass('active');
          $(`.nav-link-sub[data-group="${groupIndex}"][data-sub="${subIndex}"]`).addClass('active');

          // 激活右侧内容
          const layout = siteData[groupIndex].layout;
          const tabId = `sub-${siteData[groupIndex].category}-${subIndex}`.replace(/\s+/g, '-').toLowerCase();

          if (layout === 'tab') {
            $('#sub-tab-nav .nav-link').removeClass('active');
            $('#sub-tab-content .tab-pane').removeClass('active show');
            $('#sub-tab-nav a[href="#' + tabId + '"]').addClass('active').tab('show');
            $('#' + tabId).addClass('active show');
          } else {
            const $target = $(`#${tabId}`);
            if ($target.length) {
              $('html, body').animate({
                scrollTop: $target.offset().top - 60
              }, 500);
            }
          }

          return false; // 只跳转第一个匹配项
        }
      });
      if (found) return false;
    });
    if (found) return false;
  });

  if (!found) {
    alert('未找到匹配的导航项，请尝试其他关键词');
  }

    }
});




