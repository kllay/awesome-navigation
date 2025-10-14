let siteData = [];

function encodeURL(url) {
  return btoa(url);
}

function renderSidebar(data) {
  let html = '';
  data.forEach((group, i) => {
    html += `<li>
  <strong class="toggle-group d-flex justify-content-between align-items-center" data-index="${i}">
    <span><i class="fas ${group.icon || 'fa-folder'} mr-2"></i>${group.category}</span>
    <i class="fas fa-chevron-right toggle-icon"></i>
  </strong>
  <ul class="sub-menu d-none" id="group-${i}">`;


    group.children.forEach((sub, j) => {
      const isVertical = group.layout === 'vertical';
      const subId = `sub-${group.category}-${j}`.replace(/\s+/g, '-').toLowerCase();
      const anchorId = isVertical ? `#${subId}` : '#';
      html += `<li>
        <a href="${anchorId}" class="nav-link-sub" data-group="${i}" data-sub="${j}" data-tab="${subId}">
          ${sub.category2}
        </a>
      </li>`;
    });

    html += `</ul></li>`;
  });
  $('#nav-menu').html(html);

  // 一级分类点击展开
$('.toggle-group').on('click', function () {
  const index = $(this).data('index');
  const $submenu = $(`#group-${index}`);
  const isActive = $(this).hasClass('active');

  if (isActive) {
    // 当前项已展开 → 收起
    $submenu.addClass('d-none');
    $(this).removeClass('active');
    $(this).find('.toggle-icon').removeClass('fa-chevron-down').addClass('fa-chevron-right');
  } else {
    // 当前项未展开 → 展开并关闭其他项
    $('.sub-menu').addClass('d-none');
    $('.toggle-group').removeClass('active');
    $('.toggle-icon').removeClass('fa-chevron-down').addClass('fa-chevron-right');

    $submenu.removeClass('d-none');
    $(this).addClass('active');
    $(this).find('.toggle-icon').removeClass('fa-chevron-right').addClass('fa-chevron-down');

    // 渲染右侧内容
    renderMainTitle(siteData[index].category);
    renderSubLayout(siteData[index]);
  }
});



  // 二级分类点击跳转
  $('.nav-link-sub').on('click', function (e) {

    const groupIndex = $(this).data('group');
    const subIndex = $(this).data('sub');
    const layout = siteData[groupIndex].layout;

    //  清除所有左侧二级菜单高亮
  $('.nav-link-sub').removeClass('active');

  //  高亮当前点击的左侧项
  $(this).addClass('active');

    if (layout === 'tab') {
      e.preventDefault();
      // 清除所有 tab-link 和 tab-pane 的激活状态
      $('#sub-tab-nav .nav-link').removeClass('active');
      $('#sub-tab-content .tab-pane').removeClass('active show');
      // $('#sub-tab-nav a').eq(subIndex).tab('show');
       const tabId = `sub-${siteData[groupIndex].category}-${subIndex}`.replace(/\s+/g, '-').toLowerCase();
       $('#sub-tab-nav a[href="#' + tabId + '"]').tab('show'); 
       const $tabLink = $('#sub-tab-nav a[href="#' + tabId + '"]');
        if ($tabLink.length) {
            $tabLink.tab('show');
             $tabLink.addClass('active');
           $('#' + tabId).addClass('active show');
          } else {
            // 手动切换 tab-pane（兜底）
            $('.tab-pane').removeClass('active show');
            $('#' + tabId).addClass('active show');
          }
    } else {
      const targetId = `sub-${groupIndex}-${subIndex}`;
      const $target = $(`#${targetId}`);
      if ($target.length) {
        $('html, body').animate({
          scrollTop: $target.offset().top - 60
        }, 500);
      } else {
        console.warn('未找到目标元素:', targetId);
      }

    }
  });
}


function renderMobileMenu(data) {
  let html = '';
  data.forEach((group, i) => {
    html += `<li class="mb-2">
      <strong>${group.category}</strong>
      <ul class="ml-3">`;
    group.children.forEach((sub, j) => {
      html += `<li>
        <a href="#" class="text-white mobile-nav-link" data-group="${i}" data-sub="${j}">
          ${sub.category2}
        </a>
      </li>`;
    });
    html += `</ul></li>`;
  });
  $('#mobile-nav-menu').html(html);

  $('.mobile-nav-link').on('click', function () {
    const groupIndex = $(this).data('group');
    const subIndex = $(this).data('sub');
    $('.toggle-group').eq(groupIndex).click();
    $(`.nav-link-sub[data-group="${groupIndex}"][data-sub="${subIndex}"]`).click();
    $('#mobile-menu').fadeOut();
  });
}


function renderMainTitle(title) {
  $('#main-title').text(title);
}

function renderSubLayout(group) {
  const layout = group.layout || 'vertical';
  $('#sub-tab-nav').toggleClass('d-none', layout !== 'tab');
  $('#sub-tab-nav').html('');
  $('#sub-tab-content').html('');

  group.children.forEach((sub, j) => {
    const subId = `sub-${group.category}-${j}`.replace(/\s+/g, '-').toLowerCase();

    if (layout === 'tab') {
      $('#sub-tab-nav').append(`
        <li class="nav-item">
          <a class="nav-link ${j === 0 ? 'active' : ''}" data-toggle="tab" href="#${subId}">${sub.category2}</a>
        </li>
      `);
      $('#sub-tab-content').append(`
        <div class="tab-pane fade ${j === 0 ? 'show active' : ''}" id="${subId}">
          <div class="row">
            ${renderCards(sub.items)}
          </div>
        </div>
      `);

    } else {
      $('#sub-tab-content').append(`
        <section id="${subId}" class="mb-5">
          <h5 class="text-white mb-3">${sub.category2}</h5>
          <div class="row">${renderCards(sub.items)}</div>
        </section>
      `);
    }
  });
}

$('#sub-tab-nav').on('click', '.nav-link', function (e) {
  const tabId = $(this).attr('href').substring(1); // e.g. sub-开发工具-1

  //  清除所有 tab-pane 激活状态
  $('#sub-tab-content .tab-pane').removeClass('active show');
  $('#' + tabId).addClass('active show');

  //  清除所有 tab-link 激活状态
  $('#sub-tab-nav .nav-link').removeClass('active');
  $(this).addClass('active');

  //  同步左侧高亮
  $('.nav-link-sub').removeClass('active');
  $(`.nav-link-sub[data-tab="${tabId}"]`).addClass('active');
});


function renderCards(items) {
  return items.map(item => {
    const encoded = encodeURL(item.url);
    const iconUrl = item.icon && item.icon.trim() !== '' ? item.icon : 'assets/img/default.png';
    const editBtn = item.isLocal
      ? `<button class="btn btn-sm btn-warning edit-nav-btn mt-2" data-title="${item.title}">编辑</button>`
      : '';
    const deleteBtn = item.isLocal
      ? `<button class="btn btn-sm btn-danger delete-nav-btn mt-2" data-title="${item.title}">删除</button>`
      : '';

    return `
      <div class="col-md-3 col-sm-4 col-6 mb-4">
        <div class="card site-card text-white text-decoration-none h-100 p-2">
          <a href="jump.html?target=${encoded}&title=${encodeURIComponent(item.title)}" target="_blank" class="text-white text-decoration-none">
            <div class="d-flex flex-md-row flex-column align-items-center">
              <img src="${iconUrl}" alt="${item.title}" class="rounded-circle mb-2 mb-md-0 mr-md-2" style="width:64px; height:64px;" onerror="this.src='assets/img/default.png'">
              <div class="text-center text-md-left">
                <h6 class="mb-1">${item.title}</h6>
                <small class="desc-limit d-block" title="${item.desc}">${item.desc}</small>
              </div>
            </div>
          </a>
          ${editBtn}
          ${deleteBtn}
        </div>
      </div>
    `;
  }).join('');
}



const categories = ['main', 'aitools','wemedia','developtool', 'workassistant','foreigntrade'];

$(function () {
  
  function loadCategoriesSequentially(index = 0) {
    if (index >= categories.length) {
      // 所有数据加载完成后，渲染导航
      renderSidebar(siteData);
      renderMobileMenu(siteData);
      $('.toggle-group').first().click(); // 默认展开第一个分类
      return;
    }

    const category = categories[index];
    $.getJSON(`data/sites-${category}.json`, function (data) {
      siteData = siteData.concat(data);
      loadCategoriesSequentially(index + 1); // 加载下一个
    }).fail(function () {
      console.warn(`加载失败: sites-${category}.json`);
      loadCategoriesSequentially(index + 1); // 即使失败也继续加载下一个
    });
  }

  loadCategoriesSequentially();
});

